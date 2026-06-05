resource "aws_cloudwatch_metric_alarm" "service_down" {

 count = var.service_name != "" ? 1 : 0

 alarm_name = "${var.service_name}-down"

 comparison_operator = "LessThanThreshold"

 evaluation_periods = 1

 metric_name = "RunningTaskCount"

 namespace = "ECS/ContainerInsights"

 period = 60

 statistic = "Average"

 threshold = 1

 dimensions = {

  ClusterName = var.cluster_name

  ServiceName = var.service_name

 }

 alarm_description = "Service Down Alarm"

 treat_missing_data = "breaching"

}

resource "aws_cloudwatch_metric_alarm" "queue_backlog" {

 count = var.queue_name != "" ? 1 : 0

 alarm_name = "${var.queue_name}-backlog"

 comparison_operator = "GreaterThanThreshold"

 evaluation_periods = 1

 metric_name = "ApproximateNumberOfMessagesVisible"

 namespace = "AWS/SQS"

 period = 60

 statistic = "Average"

 threshold = 10

 dimensions = {

  QueueName = var.queue_name

 }

 alarm_description = "Queue backlog alarm"

 treat_missing_data = "notBreaching"

}

/*
resource "aws_cloudwatch_dashboard" "main" {

 count = (
  var.cluster_name == "" &&
  var.service_name == "" &&
  var.queue_name == ""
 ) ? 1 : 0

 dashboard_name = "imona-dashboard"

 dashboard_body = jsonencode({

 widgets = [

 {

 type = "metric"

 x = 0

 y = 0

 width = 12

 height = 6

 properties = {

 metrics = [

 ["ECS/ContainerInsights","RunningTaskCount","ClusterName","imona-dev-cluster","ServiceName","imona-dev-auth"],

 [".",".",".",".","ServiceName","imona-dev-worker"],

 [".",".",".",".","ServiceName","imona-dev-notification"],

 [".",".",".",".","ServiceName","imona-dev-service"]

 ]

 region = "eu-central-1"

 title = "Running Tasks"

 }

 },

 {

 type = "metric"

 x = 12

 y = 0

 width = 12

 height = 6

 properties = {

 metrics = [

 ["AWS/SQS","ApproximateNumberOfMessagesVisible","QueueName","imona-dev-events"]

 ]

 region = "eu-central-1"

 title = "Queue Size"

 }

 }

 ]

 })

}

*/