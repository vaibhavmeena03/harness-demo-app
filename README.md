# Harness Demo App

Simple Vite + React demo app for static hosting on AWS S3 with a Harness CI/CD pipeline example.

Features:
- Login page with a feature-flag-controlled UI (admin vs normal)
- Dashboard with logout
- Built for static hosting (Vite base './')

To run locally:

```pwsh
npm install
npm run dev
```

To build for production:

```pwsh
npm run build
```

To deploy to S3 (AWS CLI must be configured with credentials):

```pwsh
.\scripts\deploy-to-s3.ps1 -BucketName my-bucket-name -Region us-east-1
```

Harness pipeline example: see `harness-pipeline.yaml` for a sample pipeline that builds and syncs the `dist/` folder to S3.
