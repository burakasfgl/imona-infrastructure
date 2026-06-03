resource "aws_sqs_queue" "dlq" {

  name = "${var.project_name}-${var.environment}-dlq"

}

resource "aws_sqs_queue" "events" {

  name = "${var.project_name}-${var.environment}-events"

  visibility_timeout_seconds = 30

  message_retention_seconds = 86400

  redrive_policy = jsonencode({

    deadLetterTargetArn = aws_sqs_queue.dlq.arn

    maxReceiveCount = 3

  })

}