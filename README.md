Cloud Auditor - Automated AWS Security & Cost Watchdog
<p align="center">
<img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge" alt="Build Status"/>
<img src="https://img.shields.io/badge/cloud-AWS-orange?style=for-the-badge" alt="Cloud Provider"/>
<img src="https://img.shields.io/badge/IaC-Terraform-blueviolet?style=for-the-badge" alt="Infrastructure as Code"/>
<img src="https://img.shields.io/badge/license-MIT-lightgrey?style=for-the-badge" alt="License"/>
</p>

An automated, serverless platform built on AWS that continuously scans a cloud environment for security vulnerabilities and cost anomalies, presenting the findings on a clean, actionable, and animated dashboard.

🚀 Live Demo Showcase
This is a live recording of the Cloud Auditor dashboard, displaying findings from a scan of a live AWS account. The UI is built with React and animated with Framer Motion.

(Action Required: You need to record a GIF of your dashboard and replace this line. For example: ![Cloud Auditor Live Demo](demo.gif))

🎯 The Problem
Cloud environments are powerful but complex. Two of the biggest challenges companies face are preventing security misconfigurations that can lead to breaches and avoiding unexpected cost overruns from unused or inefficient resources. "Cloud Auditor" solves this by providing an automated "watchdog" that proactively finds these issues before they become major problems.

✨ Key Features
Automated Security Scanning: A serverless function runs on a daily schedule to scan for common, high-risk security vulnerabilities (e.g., SSH ports open to the world).

Serverless & Event-Driven: Built entirely on modern, serverless AWS services for scalability and cost-efficiency.

Infrastructure as Code (IaC): The entire cloud infrastructure, from the network foundation to the serverless functions, is defined and managed with Terraform.

Secure User Authentication: The dashboard is protected by a secure login/sign-up system powered by AWS Cognito.

Modern UI: A clean and responsive dashboard built with React and animated with Framer Motion to visualize the findings.

🛠️ Tech Stack & Tools
This project utilizes a modern, serverless-first technology stack.

<p align="center">
<a href="https://aws.amazon.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="aws" width="40" height="40"/> </a>
<a href="https://www.terraform.io/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/terraform/terraform-original-wordmark.svg" alt="terraform" width="40" height="40"/> </a>
<a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a>
<a href="https://www.python.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> </a>
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>
<a href="https://www.framer.com/motion/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/framer-motion.svg" alt="framer motion" width="40" height="40"/> </a>
<a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original-wordmark.svg" alt="git" width="40" height="40"/> </a>
</p>

Category

Technology

Infrastructure as Code

Terraform

Cloud Platform

AWS (Lambda, DynamoDB, API Gateway, EventBridge, Cognito)

Backend & Scripting

Python (with Boto3)

Frontend

React.js, Vite, Framer Motion, Axios

Authentication

AWS Cognito

🏗️ Architecture
The application is built using a fully serverless, event-driven architecture on AWS.

(Action Required: Use a tool like draw.io to create a simple diagram showing EventBridge -> Lambda Scanner -> DynamoDB -> API Gateway -> React UI and replace this line.)

<details>
<summary>Click to view detailed Data Flow</summary>

An Amazon EventBridge rule triggers the scanner on a schedule.

An AWS Lambda function (Python/Boto3) runs, scans the AWS account, and finds vulnerabilities.

The findings are written to an Amazon DynamoDB table.

A React frontend requests the data from a secure API Gateway endpoint.

A second AWS Lambda function acts as the API, fetching the findings from DynamoDB and returning them to the frontend.

</details>

🎓 What I Learned
This project was a deep dive into building a professional, secure, and automated cloud-native application. Key skills developed include:

Designing and implementing a complete serverless architecture on AWS.

Automating the entire infrastructure lifecycle with Terraform, including serverless functions, databases, and IAM permissions.

Implementing a secure user authentication system with AWS Cognito.

Building a modern, responsive frontend that interacts with a secure cloud API.

Applying DevSecOps principles by building a tool focused on automated security scanning.
