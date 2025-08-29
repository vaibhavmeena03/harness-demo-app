#!/bin/bash

# Harness CD S3 Deployment Script for React App
# This script handles the complete deployment process to AWS S3

set -e

# Configuration - these will be set by Harness variables
BUCKET_NAME="${BUCKET_NAME:-harness-react-sample-bucket}"
REGION="${REGION:-us-east-2}"
BUILD_DIR="dist"
BACKUP_DIR="backup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Function to check AWS CLI
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed"
        exit 1
    fi
    print_status "AWS CLI is available"
}

# Function to check if S3 bucket exists
check_bucket_exists() {
    if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
        print_status "S3 bucket $BUCKET_NAME exists"
        return 0
    else
        print_error "S3 bucket $BUCKET_NAME does not exist"
        return 1
    fi
}

# Function to create S3 bucket if it doesn't exist
create_bucket_if_needed() {
    if ! check_bucket_exists; then
        print_info "Creating S3 bucket: $BUCKET_NAME in region: $REGION"
        
        if [ "$REGION" = "us-east-1" ]; then
            aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
        else
            aws s3api create-bucket \
                --bucket "$BUCKET_NAME" \
                --region "$REGION" \
                --create-bucket-configuration LocationConstraint="$REGION"
        fi
        
        print_status "S3 bucket $BUCKET_NAME created successfully"
    fi
}

# Function to configure S3 bucket for static website hosting
configure_bucket() {
    print_info "Configuring S3 bucket for static website hosting"
    
    # Enable static website hosting
    aws s3api put-bucket-website \
        --bucket "$BUCKET_NAME" \
        --website-configuration '{
            "IndexDocument": {
                "Suffix": "index.html"
            },
            "ErrorDocument": {
                "Key": "index.html"
            }
        }'
    
    print_status "Static website hosting enabled"
    
    # Configure CORS
    aws s3api put-bucket-cors \
        --bucket "$BUCKET_NAME" \
        --cors-configuration '{
            "CORSRules": [
                {
                    "AllowedHeaders": ["*"],
                    "AllowedMethods": ["GET", "HEAD"],
                    "AllowedOrigins": ["*"],
                    "ExposeHeaders": []
                }
            ]
        }'
    
    print_status "CORS configuration applied"
    
    # Set bucket policy for public read access
    aws s3api put-bucket-policy \
        --bucket "$BUCKET_NAME" \
        --policy '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
                }
            ]
        }'
    
    print_status "Bucket policy applied"
    
    # Enable versioning for rollback capability
    aws s3api put-bucket-versioning \
        --bucket "$BUCKET_NAME" \
        --versioning-configuration Status=Enabled
    
    print_status "Versioning enabled"
}

# Function to create backup of current deployment
create_backup() {
    print_info "Creating backup of current deployment"
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Check if there are existing files to backup
    if aws s3 ls "s3://$BUCKET_NAME/" | grep -q "index.html"; then
        # Create timestamped backup
        BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        BACKUP_PATH="$BACKUP_DIR/backup_$BACKUP_TIMESTAMP"
        
        mkdir -p "$BACKUP_PATH"
        
        # Download current files to backup
        aws s3 sync "s3://$BUCKET_NAME/" "$BACKUP_PATH/" --exclude "builds/*" --exclude "backup/*"
        
        # Upload backup to S3
        aws s3 sync "$BACKUP_PATH/" "s3://$BUCKET_NAME/backup/backup_$BACKUP_TIMESTAMP/"
        
        print_status "Backup created: backup_$BACKUP_TIMESTAMP"
    else
        print_warning "No existing deployment found to backup"
    fi
}

# Function to deploy application files
deploy_files() {
    print_info "Deploying application files to S3"
    
    # Check if build directory exists
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "Build directory $BUILD_DIR not found"
        exit 1
    fi
    
    # Sync build files to S3 with proper cache headers
    aws s3 sync "$BUILD_DIR/" "s3://$BUCKET_NAME/" \
        --delete \
        --cache-control "max-age=31536000,public" \
        --exclude "*.map" \
        --exclude "*.txt"
    
    print_status "Application files synced to S3"
    
    # Set proper content types for HTML files
    aws s3 cp "$BUILD_DIR/index.html" "s3://$BUCKET_NAME/" \
        --content-type "text/html" \
        --cache-control "no-cache"
    
    print_status "HTML files configured with proper content types"
    
    # Set cache headers for assets
    if [ -d "$BUILD_DIR/assets" ]; then
        aws s3 cp "$BUILD_DIR/assets/" "s3://$BUCKET_NAME/assets/" \
            --recursive \
            --cache-control "max-age=31536000,public"
        
        print_status "Asset files configured with cache headers"
    fi
}

# Function to perform health check
health_check() {
    print_info "Performing health check"
    
    # Wait for deployment to propagate
    sleep 30
    
    # Get website URL
    WEBSITE_URL=$(aws s3api get-bucket-website --bucket "$BUCKET_NAME" --query 'WebsiteEndpoint' --output text)
    
    if [ -z "$WEBSITE_URL" ]; then
        print_error "Could not retrieve website URL"
        return 1
    fi
    
    print_info "Website URL: http://$WEBSITE_URL"
    
    # Perform HTTP health check
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$WEBSITE_URL" || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        print_status "Health check passed - HTTP $HTTP_STATUS"
        print_status "Application deployed successfully to: http://$WEBSITE_URL"
        return 0
    else
        print_error "Health check failed - HTTP $HTTP_STATUS"
        return 1
    fi
}

# Function to cleanup temporary files
cleanup() {
    print_info "Cleaning up temporary files"
    
    if [ -d "$BACKUP_DIR" ]; then
        rm -rf "$BACKUP_DIR"
    fi
    
    print_status "Cleanup completed"
}

# Main execution
main() {
    print_info "Starting S3 deployment process"
    
    # Set error handling
    trap cleanup EXIT
    
    # Check prerequisites
    check_aws_cli
    
    # Create and configure bucket
    create_bucket_if_needed
    configure_bucket
    
    # Create backup
    create_backup
    
    # Deploy files
    deploy_files
    
    # Health check
    if health_check; then
        print_status "Deployment completed successfully!"
        exit 0
    else
        print_error "Deployment failed health check"
        exit 1
    fi
}

# Run main function
main "$@"
