# IMONA Gamification Platform

## Project Overview

IMONA Gamification Platform is a cloud-native microservice-based gamification system designed with scalable and event-driven architecture principles.

The project focuses on authentication, authorization, distributed services, infrastructure automation, caching, messaging systems, and cloud-native deployment practices.

The platform allows authenticated users to gain experience points (XP), interact with gamification mechanics, and consume backend services running on AWS infrastructure.

---

## Architecture

```text
Client

↓

CloudFront CDN

↓

ALB

↓

ECS Services

↓

Users Service / Gamification Service

↓

Cognito Authentication

↓

MongoDB + Redis

↓

SQS

↓

Worker Service


## Infrastructure Architecture

Infrastructure is designed using modular Terraform architecture.

### Environment Structure

```text
terraform/

├── environments/

│   ├── dev/

│   ├── staging/

│   └── prod/

└── modules/

    ├── alb/

    ├── auth/

    ├── cognito/

    ├── dashboard/

    ├── ecr/

    ├── ecs/

    ├── iam/

    ├── lambda/

    ├── monitoring/

    ├── notification/

    └── redis/
```

### Infrastructure Components

* Environment based infrastructure separation
* Reusable Terraform modules
* Remote state management
* ECS based container infrastructure
* Load balancer architecture
* IAM permission management
* Monitoring infrastructure
* Authentication infrastructure
* Cache infrastructure
* Notification infrastructure

The infrastructure layer was designed with scalability and reusability principles.


## Features

### Authentication & Authorization

* JWT based authentication using AWS Cognito
* Access token validation
* Role-based authorization
* Protected API endpoints

### Users Service

* Retrieve authenticated user profile
* User domain separation
* Role-based route protection

### Gamification Service

* XP calculation engine
* Mission completion flow
* Reward triggering
* Leaderboard infrastructure

### Reward Engine

* Event-driven reward processing
* SQS based message architecture
* Worker service consumption
* Reward persistence logic

### Infrastructure

* Terraform managed infrastructure
* AWS resource provisioning
* S3 static hosting
* CloudFront CDN distribution

---

## Technologies Used

Backend:

* Node.js
* Express.js

Databases:

* MongoDB Atlas
* Redis

AWS Services:

* Cognito
* SQS
* CloudFront
* S3
* IAM

Infrastructure:

* Terraform

---

## Services

```text
users-service/

gamification-service/

imona-auth/

imona-worker/

terraform/

notification-service/
```

---

## Setup

Clone repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run services:

```bash
node app.js
```

---

## Infrastructure Deployment

Terraform:

```bash
terraform init

terraform plan

terraform apply
```

---

## Screenshots

Add:

* CloudFront Distribution Screenshot
* AWS Infrastructure Screenshots
* Authentication Flow
* Architecture Diagram

---

## Current Status

Completed:

* Authentication
* Authorization
* Users Service
* Gamification Service
* MongoDB Integration
* Redis Integration
* SQS Integration
* CloudFront CDN
* S3 Hosting
* Terraform Infrastructure

Work In Progress:

* Extended Event Driven Flows
* Monitoring Improvements

---

## Author

Burak Sofuoğlu

Software Engineering Student

Focused Areas:

* Cloud Architecture
* Distributed Systems
* Backend Engineering
* Infrastructure Automation
