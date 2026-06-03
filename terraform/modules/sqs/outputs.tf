output "queue_url" {

 value = aws_sqs_queue.events.id

}

output "queue_arn" {

 value = aws_sqs_queue.events.arn

}