resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-${var.environment}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Action = "sts:AssumeRole"

        Effect = "Allow"

        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_role" {

  name = "${var.project_name}-${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [

      {

        Action = "sts:AssumeRole"

        Effect = "Allow"

        Principal = {

          Service = "ecs-tasks.amazonaws.com"

        }

      }

    ]

  })

}


resource "aws_iam_policy" "sqs_access" {

  name = "${var.project_name}-${var.environment}-sqs-policy"

  policy = jsonencode({

    Version = "2012-10-17"

    Statement = [

      {

        Effect="Allow"

        Action=[

          "sqs:SendMessage",

          "sqs:ReceiveMessage",

          "sqs:DeleteMessage",

          "sqs:GetQueueAttributes"

]

        Resource="*"

      }

    ]

  })

}

resource "aws_iam_role_policy_attachment" "attach_sqs" {

 role = aws_iam_role.ecs_task_role.name

 policy_arn = aws_iam_policy.sqs_access.arn

}



resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_policy" "secrets_access" {

  name = "${var.project_name}-${var.environment}-secrets-policy"

  policy = jsonencode({

    Version = "2012-10-17"

    Statement = [

      {

        Effect = "Allow"

        Action = [

          "secretsmanager:GetSecretValue"

        ]

        Resource = "*"

      }

    ]

  })

}

resource "aws_iam_role_policy_attachment" "attach_secrets_policy" {

  role = aws_iam_role.ecs_task_execution_role.name

  policy_arn = aws_iam_policy.secrets_access.arn

}