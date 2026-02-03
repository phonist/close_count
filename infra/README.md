# Close Count AWS Migration (Terraform + CodePipeline)

This folder scaffolds a single AWS account with env-prefixed resources for dev/test/prod:
- ECS Fargate for the API
- S3 + CloudFront for the React frontend
- DocumentDB for MongoDB compatibility
- CodePipeline + CodeBuild for CI/CD

## Prereqs
- AWS account, AWS CLI configured
- CodeStar Connection to GitHub (for CodePipeline source)
- ACM certificate in ap-southeast-1 if you want a custom CloudFront domain

## DocumentDB TLS note
The DocumentDB connection string in Terraform currently uses TLS with **allow invalid certs** to keep setup simple. For production, use the AWS DocumentDB CA bundle and set `MONGO_CA_FILE` in ECS, or update the connection string to validate the certificate.

## Layout
- `infra/envs/dev`, `infra/envs/test`, `infra/envs/prod`
- `infra/modules/*` for network, ECS, frontend, DocumentDB, pipeline
- `infra/buildspecs/*` for CodeBuild

## How to use
1) Copy the env example file and fill values:
```
cp infra/envs/dev/terraform.tfvars.example infra/envs/dev/terraform.tfvars
```
2) Initialize and apply:
```
cd infra/envs/dev
terraform init
```
3) Format and validate:
```
terraform fmt -recursive
terraform validate
```
4) Plan with the dev vars file:
```
terraform plan -var-file=terraform.tfvars
```
5) Apply:
```
terraform apply -var-file=terraform.tfvars
```
6) Destroy (optional):
```
terraform destroy -var-file=terraform.tfvars
```
Repeat for test/prod.

## Notes
- `terraform.tfvars` should not be committed if it contains secrets
- API container expects `MONGO_URI` and `JWT_SECRET` as secrets (Secrets Manager)
- `server/Dockerfile.prod` is used for ECS builds
- React builds use `REACT_APP_API_URL` and `REACT_APP_HOST`
