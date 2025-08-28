param(
  [Parameter(Mandatory=$true)]
  [string]$BucketName,
  [Parameter(Mandatory=$false)]
  [string]$Region = 'us-east-1'
)

Write-Host "Deploying dist/ to S3 bucket: $BucketName in region $Region"

if (-not (Test-Path -Path './dist')) {
  Write-Error "dist/ not found. Run 'npm run build' first."
  exit 1
}

# Sync using AWS CLI. Assumes AWS credentials/region available in environment or shared config.
aws s3 sync ./dist "s3://$BucketName/" --delete --region $Region

if ($LASTEXITCODE -ne 0) { throw "aws s3 sync failed" }

Write-Host "Deployment finished. If website hosting is enabled, your site should be available at the bucket's website endpoint."
