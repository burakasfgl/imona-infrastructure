resource "aws_lambda_function" "this" {

  function_name = var.function_name

  runtime = "nodejs20.x"

  role = var.role_arn

  handler = "index.handler"

  filename = var.zip_path

  source_code_hash = filebase64sha256(
    var.zip_path
  )

}

resource "aws_lambda_event_source_mapping" "dlq_trigger" {

  event_source_arn = var.queue_arn

  function_name = aws_lambda_function.this.arn

  batch_size = 1

  enabled = true

}