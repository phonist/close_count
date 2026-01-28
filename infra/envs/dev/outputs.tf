output "api_alb_dns_name" {
  value = module.ecs_api.alb_dns_name
}

output "frontend_cloudfront_domain_name" {
  value = module.frontend.cloudfront_domain_name
}

output "api_cloudfront_domain_name" {
  value = module.api_cloudfront.cloudfront_domain_name
}
