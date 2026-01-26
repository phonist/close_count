variable "name_prefix" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "ingress_sg_id" { type = string }
variable "db_name" { type = string }
variable "db_username" { type = string }
variable "db_password" { type = string }
variable "instance_class" { type = string }
variable "cluster_size" { type = number }
variable "tags" { type = map(string) }

resource "aws_security_group" "docdb" {
  name        = "${var.name_prefix}-docdb-sg"
  description = "DocumentDB security group"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [var.ingress_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-docdb-sg"
  })
}

resource "aws_docdb_subnet_group" "this" {
  name       = "${var.name_prefix}-docdb-subnets"
  subnet_ids = var.private_subnet_ids
  tags = merge(var.tags, {
    Name = "${var.name_prefix}-docdb-subnets"
  })
}

resource "aws_docdb_cluster" "this" {
  cluster_identifier      = "${var.name_prefix}-docdb"
  master_username         = var.db_username
  master_password         = var.db_password
  db_subnet_group_name    = aws_docdb_subnet_group.this.name
  vpc_security_group_ids  = [aws_security_group.docdb.id]
  engine                  = "docdb"
  backup_retention_period = 7
  skip_final_snapshot     = true
  tags = merge(var.tags, {
    Name = "${var.name_prefix}-docdb"
  })
}

resource "aws_docdb_cluster_instance" "this" {
  count              = var.cluster_size
  identifier         = "${var.name_prefix}-docdb-${count.index + 1}"
  cluster_identifier = aws_docdb_cluster.this.id
  instance_class     = var.instance_class
  tags = merge(var.tags, {
    Name = "${var.name_prefix}-docdb-${count.index + 1}"
  })
}

resource "aws_secretsmanager_secret" "mongo_uri" {
  name = "${var.name_prefix}-mongo-uri"
  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "mongo_uri" {
  secret_id     = aws_secretsmanager_secret.mongo_uri.id
  secret_string = "mongodb://${var.db_username}:${var.db_password}@${aws_docdb_cluster.this.endpoint}:27017/${var.db_name}?tls=true&tlsAllowInvalidHostnames=true&tlsAllowInvalidCertificates=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
}

output "mongo_uri_secret_arn" { value = aws_secretsmanager_secret.mongo_uri.arn }
output "docdb_endpoint" { value = aws_docdb_cluster.this.endpoint }
output "docdb_sg_id" { value = aws_security_group.docdb.id }
