terraform {

  backend "s3" {

    bucket         = "imona-terraform-state-burak"
    key            = "dev/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true

  }

}