# Harness CD Pipeline for React App Deployment

This directory contains the complete Harness CD pipeline configuration for building, testing, and deploying the Harness DevOps React POC application to AWS S3.

## 🚀 Pipeline Overview

The pipeline consists of two main stages:

1. **Build and Test Stage** - CI pipeline for building and testing the React application
2. **Deploy to S3 Stage** - CD pipeline for deploying to AWS S3 with static website hosting

## 📁 Files Structure

```
harness-pipeline/
├── README.md                           # This file
├── pipeline.yml                        # Main pipeline configuration
├── service.yml                         # Service definition
├── environment.yml                     # Environment configuration
├── infrastructure-definition.yml       # S3 infrastructure definition
├── aws-connector.yml                   # AWS connector configuration
├── github-connector.yml                # GitHub connector configuration
└── s3-manifest.yaml                    # S3 deployment manifest
```

## 🔧 Configuration Files

### 1. Pipeline Configuration (`pipeline.yml`)
- **Build Stage**: Code checkout, dependency installation, testing, and build
- **Deploy Stage**: S3 bucket configuration, file upload, and health checks
- **Rollback**: Automatic rollback on deployment failures

### 2. Service Definition (`service.yml`)
- Defines the React application service
- Configures source code from GitHub
- Sets up S3 deployment artifacts

### 3. Environment (`environment.yml`)
- Production environment configuration
- Tags and metadata for environment management

### 4. Infrastructure (`infrastructure-definition.yml`)
- S3 bucket configuration
- AWS region and bucket settings
- CD enablement

### 5. Connectors
- **AWS Connector**: For S3 deployment and AWS services
- **GitHub Connector**: For source code access

## 🛠️ Prerequisites

### AWS Setup
1. **S3 Bucket**: Create a bucket named `harness-react-sample-bucket`
2. **IAM User**: Create an IAM user with S3 permissions
3. **Access Keys**: Generate access and secret keys

### Required AWS Permissions
```json
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
        "s3:PutBucketWebsite"
      ],
      "Resource": [
        "arn:aws:s3:::harness-react-sample-bucket",
        "arn:aws:s3:::harness-react-sample-bucket/*"
      ]
    }
  ]
}
```

### Harness Setup
1. **Project**: Create a project in Harness
2. **Secrets**: Configure the following secrets:
   - `aws_access_key`: AWS access key
   - `aws_secret_key`: AWS secret key
   - `github_username`: GitHub username
   - `github_token`: GitHub personal access token

## 🚀 Pipeline Execution

### Build Stage
1. **Code Checkout**: Clone from GitHub main branch
2. **Node.js Setup**: Install Node.js 18
3. **Dependencies**: Install npm packages
4. **Testing**: Run unit tests with coverage
5. **Build**: Create production build
6. **Artifact Upload**: Upload build to S3

### Deploy Stage
1. **Artifact Download**: Download build from S3
2. **S3 Configuration**: Enable website hosting, CORS, and policies
3. **File Upload**: Sync build files to S3
4. **Health Check**: Verify deployment success

## 🔍 Pipeline Features

### ✅ Quality Gates
- **Test Coverage**: Ensures tests pass before deployment
- **Build Validation**: Verifies build output integrity
- **Health Checks**: Validates deployment success

### 🔄 Rollback Capability
- Automatic rollback on stage failures
- Previous version restoration capability
- Health check validation

### 📊 Monitoring
- Build artifact metadata tracking
- Deployment status monitoring
- Health check reporting

## 🎯 Customization

### Environment Variables
Update the following in your Harness project:
- `bucketName`: Your S3 bucket name
- `prefix`: S3 key prefix for organization
- `region`: AWS region for deployment

### Build Commands
Modify the build stage in `pipeline.yml`:
- Node.js version
- Test commands
- Build parameters

### Deployment Settings
Adjust S3 configuration in the deploy stage:
- CORS settings
- Cache control headers
- Bucket policies

## 🚨 Troubleshooting

### Common Issues
1. **AWS Permissions**: Ensure IAM user has required S3 permissions
2. **Bucket Name**: Verify S3 bucket exists and is accessible
3. **Secrets**: Check Harness secrets are properly configured
4. **Region**: Ensure AWS region matches your bucket location

### Debug Steps
1. Check pipeline execution logs
2. Verify AWS credentials in Harness
3. Test S3 bucket access manually
4. Review IAM permissions

## 📈 Best Practices

### Security
- Use IAM roles with minimal required permissions
- Store sensitive data in Harness secrets
- Enable S3 bucket versioning for rollbacks

### Performance
- Enable S3 transfer acceleration for large files
- Use appropriate cache control headers
- Implement CDN for global distribution

### Monitoring
- Set up CloudWatch alarms for S3 metrics
- Monitor pipeline execution times
- Track deployment success rates

## 🔗 Related Resources

- [Harness CD Documentation](https://docs.harness.io/category/cd)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [React Build Optimization](https://create-react-app.dev/docs/production-build/)
- [Harness Connectors](https://docs.harness.io/category/connectors)

## 📞 Support

For issues or questions:
1. Check Harness documentation
2. Review pipeline execution logs
3. Verify AWS configuration
4. Contact Harness support

---

**Built with ❤️ using Harness CD for DevOps excellence**
