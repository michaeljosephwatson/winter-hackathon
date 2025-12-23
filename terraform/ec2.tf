resource "aws_security_group" "ssh_sg" {
  name        = "c20-mikey-hackathon-ec2-sg"
  description = "Allow SSH, client, and WebSocket access"

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Client HTTP
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # WebSocket
  ingress {
    from_port   = 8765
    to_port     = 8765
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "ec2" {
  ami           = "resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
  instance_type = "t3.micro"
  key_name      = "c20-mikey-hackathon-key"
  vpc_security_group_ids = [aws_security_group.ssh_sg.id]

  tags = {
    Name = "c20-mikey-hackathon-ec2"
  }
}
