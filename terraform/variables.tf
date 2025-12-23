variable "AWS_ACCESS_KEY_ID" {
  type        = string
  description = "AWS access key ID"
  sensitive   = true
}

variable "AWS_SECRET_ACCESS_KEY" {
  type        = string
  description = "AWS secret access key"
  sensitive   = true
}

variable "AWS_DEFAULT_REGION" {
  type        = string
  description = "AWS region"
  default     = "eu-west-2"
}