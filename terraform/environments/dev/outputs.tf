output "redis_endpoint" {

  value = module.redis.redis_endpoint

}

output "queue_url" {

 value = module.sqs.queue_url

}

output "cognito_user_pool_id" {

 value = module.cognito.user_pool_id

}

output "cognito_client_id" {

 value = module.cognito.client_id

}