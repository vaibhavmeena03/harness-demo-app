#!/bin/bash

# Harness CD Pipeline Setup Script for React App Deployment
# This script helps set up the initial configuration for the Harness pipeline

set -e

echo "🚀 Harness CD Pipeline Setup for React App Deployment"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if command -v aws &> /dev/null; then
        print_status "AWS CLI is installed"
        aws --version
    else
        print_error "AWS CLI is not installed. Please install it first:"
        echo "  https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
}

# Check if AWS credentials are configured
check_aws_credentials() {
    if aws sts get-caller-identity &> /dev/null; then
        print_status "AWS credentials are configured"
        aws sts get-caller-identity
    else
        print_error "AWS credentials are not configured. Please run:"
        echo "  aws configure"
        exit 1
    fi
}

# Create S3 bucket
create_s3_bucket() {
    local bucket_name="harness-react-sample-bucket"
    local region="us-east-1"
    
    print_info "Creating S3 bucket: $bucket_name in region: $region"
    
    if aws s3api head-bucket --bucket "$bucket_name" 2>/dev/null; then
        print_status "Bucket $bucket_name already exists"
    else
        aws s3api create-bucket \
            --bucket "$bucket_name" \
            --region "$region" \
            --create-bucket-configuration LocationConstraint="$region"
        print_status "Bucket $bucket_name created successfully"
    fi
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket "$bucket_name" \
        --versioning-configuration Status=Enabled
    
    print_status "Versioning enabled on bucket $bucket_name"
}

# Create IAM user and policy
create_iam_user() {
    local user_name="harness-deployment-user"
    local policy_name="HarnessS3DeploymentPolicy"
    
    print_info "Creating IAM user: $user_name"
    
    # Create user if it doesn't exist
    if ! aws iam get-user --user-name "$user_name" &> /dev/null; then
        aws iam create-user --user-name "$user_name"
        print_status "IAM user $user_name created"
    else
        print_status "IAM user $user_name already exists"
    fi
    
    # Create policy document
    cat > /tmp/harness-s3-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:PutBucketPolicy",
                "s3:PutBucketCors",
                "s3:PutBucketWebsite",
                "s3:GetBucketWebsite"
            ],
            "Resource": [
                "arn:aws:s3:::harness-react-sample-bucket",
                "arn:aws:s3:::harness-react-sample-bucket/*"
            ]
        }
    ]
}
EOF
    
    # Create policy if it doesn't exist
    if ! aws iam get-policy --policy-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/$policy_name" &> /dev/null; then
        aws iam create-policy \
            --policy-name "$policy_name" \
            --policy-document file:///tmp/harness-s3-policy.json
        print_status "IAM policy $policy_name created"
    else
        print_status "IAM policy $policy_name already exists"
    fi
    
    # Attach policy to user
    aws iam attach-user-policy \
        --user-name "$user_name" \
        --policy-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/$policy_name"
    
    print_status "Policy attached to user $user_name"
    
    # Create access keys
    print_info "Creating access keys for user $user_name"
    local keys_output=$(aws iam create-access-key --user-name "$user_name")
    
    echo "$keys_output" > /tmp/access-keys.json
    
    print_status "Access keys created and saved to /tmp/access-keys.json"
    print_warning "Please securely store these keys and configure them in Harness secrets"
    
    # Clean up temporary files
    rm -f /tmp/harness-s3-policy.json
}

# Generate Harness secrets configuration
generate_harness_config() {
    print_info "Generating Harness configuration template"
    
    cat > /tmp/harness-secrets-template.txt << EOF
# Harness Secrets Configuration
# Add these secrets to your Harness project

## AWS Secrets
aws_access_key: [Your AWS Access Key]
aws_secret_key: [Your AWS Secret Key]

## GitHub Secrets
github_username: [Your GitHub Username]
github_token: [Your GitHub Personal Access Token]

## Project Configuration
project_identifier: [Your Harness Project ID]
org_identifier: [Your Harness Organization ID]
account_identifier: [Your Harness Account ID]

## S3 Configuration
bucket_name: harness-react-sample-bucket
region: us-east-1
prefix: app/
EOF
    
    print_status "Harness configuration template saved to /tmp/harness-secrets-template.txt"
}

# Main execution
main() {
    echo "Starting setup process..."
    
    # Check prerequisites
    check_aws_cli
    check_aws_credentials
    
    # Create AWS resources
    create_s3_bucket
    create_iam_user
    
    # Generate configuration
    generate_harness_config
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Review the access keys in /tmp/access-keys.json"
    echo "2. Configure the secrets in Harness using /tmp/harness-secrets-template.txt"
    echo "3. Update the pipeline YAML files with your project identifiers"
    echo "4. Import the pipeline into Harness CD"
    echo ""
    echo "For more information, see the README.md file in this directory."
}

# Run main function
main "$@"
