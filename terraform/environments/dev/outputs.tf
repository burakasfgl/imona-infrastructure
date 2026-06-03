output "redis_endpoint" {

  value = module.redis.redis_endpoint

}

output "queue_url" {

 value = module.sqs.queue_url

}