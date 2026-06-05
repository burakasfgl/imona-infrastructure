resource "aws_cloudwatch_dashboard" "main" {

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

 ["ECS/ContainerInsights","RunningTaskCount","ClusterName",var.cluster_name,"ServiceName","imona-dev-auth"],

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

 ["AWS/SQS","ApproximateNumberOfMessagesVisible","QueueName",var.queue_name]

 ]

 region = "eu-central-1"

 title = "Queue Size"

 }

 }

 ]

 })

}