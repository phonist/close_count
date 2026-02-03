terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "${var.project}-${var.env}"
  tags = {
    Project = var.project
    Env     = var.env
  }
}

module "network" {
  source               = "../../modules/network"
  name_prefix          = local.name_prefix
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  tags                 = local.tags
}

module "documentdb" {
  source             = "../../modules/documentdb"
  name_prefix        = local.name_prefix
  vpc_id             = module.network.vpc_id
  private_subnet_ids = module.network.private_subnet_ids
  ingress_sg_id      = module.ecs_api.service_sg_id
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
  instance_class     = var.docdb_instance_class
  cluster_size       = var.docdb_cluster_size
  tags               = local.tags
}

module "ecs_api" {
  source               = "../../modules/ecs-api"
  name_prefix          = local.name_prefix
  vpc_id               = module.network.vpc_id
  public_subnet_ids    = module.network.public_subnet_ids
  private_subnet_ids   = module.network.private_subnet_ids
  container_port       = 8005
  desired_count        = var.api_desired_count
  env_name             = var.env
  client_url           = var.client_url
  mongo_uri_secret_arn = module.documentdb.mongo_uri_secret_arn
  jwt_secret_arn       = var.jwt_secret_arn
  tags                 = local.tags
}

module "frontend" {
  source           = "../../modules/frontend"
  name_prefix      = local.name_prefix
  domain_name      = var.domain_name
  hosted_zone_name = var.hosted_zone_name
  tags             = local.tags
}

module "api_cloudfront" {
  source       = "../../modules/api-cloudfront"
  name_prefix  = local.name_prefix
  alb_dns_name = module.ecs_api.alb_dns_name
  tags         = local.tags
}

module "pipeline" {
  source                     = "../../modules/pipeline"
  name_prefix                = local.name_prefix
  codestar_connection_arn    = var.codestar_connection_arn
  repo_owner                 = var.repo_owner
  repo_name                  = var.repo_name
  repo_branch                = var.repo_branch
  ecr_repo_url               = module.ecs_api.ecr_repo_url
  ecs_cluster_name           = module.ecs_api.ecs_cluster_name
  ecs_service_name           = module.ecs_api.ecs_service_name
  ecs_container_name         = module.ecs_api.ecs_container_name
  web_bucket_name            = module.frontend.web_bucket_name
  cloudfront_distribution_id = module.frontend.cloudfront_distribution_id
  react_app_api_url          = var.react_app_api_url
  react_app_host             = var.react_app_host
  tags                       = local.tags
}
