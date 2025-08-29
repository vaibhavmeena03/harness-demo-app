# 🚀 Harness CD Pipeline Setup Guide

This guide will help you set up the complete Harness CD pipeline for your React application deployment to AWS S3.

## 📋 Prerequisites

### 1. Harness Account Setup
- ✅ Harness account created
- ✅ Project `[YOUR_PROJECT_ID]` exists
- ✅ API Key generated: `[YOUR_HARNESS_API_KEY]`
- ✅ Account ID: `[YOUR_HARNESS_ACCOUNT_ID]`

### 2. AWS Credentials
- ✅ AWS Access Key: `[YOUR_AWS_ACCESS_KEY]`
- ✅ AWS Secret Key: `[YOUR_AWS_SECRET_KEY]`
- ✅ AWS Region: `[YOUR_AWS_REGION]`
- ✅ S3 Bucket: `[YOUR_S3_BUCKET_NAME]`

### 3. GitHub Access
- ✅ GitHub Username: `[YOUR_GITHUB_USERNAME]`
- ✅ GitHub Personal Access Token: `[YOUR_GITHUB_PAT]`
- ✅ Repository: `[YOUR_GITHUB_USERNAME]/[YOUR_REPOSITORY_NAME]`

## 🛠️ Step-by-Step Setup

### Step 1: Install Harness CLI

```bash
# Download Harness CLI
curl -LO https://github.com/harness/harness-cli/releases/download/v0.0.29/harness-v0.0.29-darwin-amd64.tar.gz

# Extract and setup
tar -xvf harness-v0.0.29-darwin-amd64.tar.gz
export PATH="$(pwd):$PATH"
echo 'export PATH="'$(pwd)':$PATH"' >> ~/.bash_profile

# Verify installation
./harness --version
```

### Step 2: Login to Harness

```bash
./harness login --api-key [YOUR_HARNESS_API_KEY] --account-id [YOUR_HARNESS_ACCOUNT_ID]
```

### Step 3: Create Secrets

```bash
# Create GitHub PAT secret
./harness secret apply --token [YOUR_GITHUB_PAT] --secret-name "harness_gitpat" --project-id [YOUR_PROJECT_ID]

# Create AWS secret key secret
./harness secret apply --token [YOUR_AWS_SECRET_KEY] --secret-name "aws_secret_key" --secret-type aws --project-id [YOUR_PROJECT_ID]
```

### Step 4: Create Connectors

Since the CLI doesn't support file-based connector creation directly, you'll need to create these through the Harness UI:

#### GitHub Connector
1. Go to **Connectors** → **New Connector**
2. Select **GitHub**
3. Use these settings:
   - **Name**: `github-connector`
   - **URL**: `https://github.com`
   - **Authentication**: Username/Password
   - **Username**: `[YOUR_GITHUB_USERNAME]`
   - **Password**: Use the secret `harness_gitpat`
   - **API Access**: Token
   - **Token**: Use the secret `harness_gitpat`

#### AWS Connector
1. Go to **Connectors** → **New Connector**
2. Select **AWS**
3. Use these settings:
   - **Name**: `aws-connector`
   - **Authentication**: Manual
   - **Access Key**: `[YOUR_AWS_ACCESS_KEY]`
   - **Secret Key**: Use the secret `aws_secret_key`
   - **Region**: `[YOUR_AWS_REGION]`

### Step 5: Create Environment

1. Go to **Environments** → **New Environment**
2. Use the configuration from `environment.yml`:
   - **Name**: `react-app-production`
   - **Type**: Production
   - **Project**: `[YOUR_PROJECT_ID]`

### Step 6: Create Infrastructure Definition

1. Go to **Infrastructure** → **New Infrastructure**
2. Use the configuration from `infrastructure-definition.yml`:
   - **Name**: `s3-infrastructure`
   - **Type**: Custom
   - **Environment**: `react-app-production`
   - **Connector**: `aws-connector`

### Step 7: Create Service

1. Go to **Services** → **New Service**
2. Use the configuration from `service.yml`:
   - **Name**: `harness-react-sample`
   - **Type**: Custom
   - **Connector**: `github-connector`

### Step 8: Create Pipeline

1. Go to **Pipelines** → **New Pipeline**
2. Use the configuration from `pipeline.yml`:
   - **Name**: `harness-react-sample-pipeline`
   - **Type**: Custom
   - **Service**: `harness-react-sample`
   - **Environment**: `react-app-production`

## 🔧 Configuration Details

### Pipeline Stages

#### 1. Build and Test Stage
- **Code Checkout**: From GitHub main branch
- **Node.js Setup**: Installs Node.js 18
- **Dependencies**: Installs npm packages with caching
- **Testing**: Runs unit tests with coverage
- **Build**: Creates production build
- **Artifact Upload**: Uploads build to S3

#### 2. Deploy to S3 Stage
- **Artifact Download**: Downloads build from S3
- **S3 Configuration**: Enables website hosting, CORS, policies
- **File Upload**: Syncs build files to S3
- **Deployment Verification**: Checks deployment success

### S3 Configuration

The pipeline automatically:
- ✅ Creates S3 bucket if it doesn't exist
- ✅ Enables static website hosting
- ✅ Configures CORS for web access
- ✅ Sets public read permissions
- ✅ Enables versioning for rollbacks
- ✅ Applies proper cache headers
- ✅ Creates backups before deployment

## 🚀 Running the Pipeline

### Manual Execution
1. Go to **Pipelines** → **harness-react-sample-pipeline**
2. Click **Run Pipeline**
3. Select branch: `main`
4. Click **Run Pipeline**

### Automatic Execution
The pipeline will automatically:
1. **Build** your React application
2. **Test** with comprehensive coverage
3. **Deploy** to S3 with proper configuration
4. **Verify** deployment success
5. **Provide** website URL

## 📊 Expected Output

After successful execution, you'll see:
```
✅ Build completed successfully
✅ Tests passed with coverage
✅ S3 bucket configured
✅ Files deployed to S3
✅ Deployment verified
🌐 Your React app is now live at: http://[YOUR_BUCKET_NAME].s3-website.[YOUR_REGION].amazonaws.com
```

## 🔍 Troubleshooting

### Common Issues

#### 1. AWS Permissions
**Error**: Access denied to S3
**Solution**: Ensure IAM user has required S3 permissions

#### 2. GitHub Access
**Error**: Repository access denied
**Solution**: Verify GitHub token has repo access

#### 3. Build Failures
**Error**: npm install fails
**Solution**: Check package.json and node_modules

#### 4. S3 Bucket Issues
**Error**: Bucket already exists
**Solution**: Pipeline handles this automatically

### Debug Steps
1. Check pipeline execution logs
2. Verify connector configurations
3. Test AWS credentials manually
4. Review GitHub access permissions

## 📈 Monitoring

### Pipeline Metrics
- Build time
- Test coverage
- Deployment success rate
- Rollback frequency

### S3 Metrics
- File upload success
- Website availability
- Cache hit rates
- Error rates

## 🔄 Rollback

The pipeline includes automatic rollback:
- **On Build Failure**: Previous build remains
- **On Test Failure**: No deployment
- **On Deploy Failure**: Previous version restored
- **Manual Rollback**: Available through Harness UI

## 🎯 Best Practices

### Security
- Use IAM roles with minimal permissions
- Store secrets in Harness secret manager
- Enable S3 bucket versioning
- Regular security audits

### Performance
- Enable S3 transfer acceleration
- Use appropriate cache headers
- Implement CDN for global distribution
- Monitor deployment times

### Reliability
- Comprehensive testing before deployment
- Automated health checks
- Backup and rollback strategies
- Monitoring and alerting

## 📞 Support

For issues or questions:
1. Check Harness documentation
2. Review pipeline execution logs
3. Verify AWS and GitHub configurations
4. Contact Harness support

---

**🎉 Your React application is now ready for automated CI/CD deployment to AWS S3!**
