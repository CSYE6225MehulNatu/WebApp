packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.0.0, < 2.0.0"
    }
  }
}

variable "project_id" {
  type = string
}

variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}

variable "zone" {
  type = string
}

variable "source_image" {
  type    = string
  default = ""
}

variable "disk_size" {
  type    = number
  default = 20
}

variable "disk_type" {
  type    = string
  default = "pd-standard"
}

variable "credentials_file_path" {
  type = string
}

variable "webapp_image_family" {
  type = string
  default = "csye6225-webapp-image"
}

variable "ssh_username" {
  type = string
}

source "googlecompute" "csye6225-webapp-custom-image" {
  project_id              = var.project_id
  source_image_family     = var.source_image_family
  zone                    = var.zone
  disk_size               = var.disk_size
  disk_type               = var.disk_type
  image_name              = "csye6225-webapp-image-{{timestamp}}"
  image_description       = "CSYE 6225 WebApp Image custom"
  image_family            = var.webapp_image_family
  image_project_id        = var.project_id
  image_storage_locations = ["us"]
  ssh_username            = var.ssh_username
  credentials_file        = var.credentials_file_path
}




build {
  sources = [
    "source.googlecompute.csye6225-webapp-custom-image"
  ]

  provisioner "file" {
    source      = "./packer/webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "./packer/WebappService.service"
    destination = "/tmp/WebappService.service"
  }


  provisioner "shell" {
    scripts = [
      "./packer/installation.sh",
      "./packer/runner.sh"
    ]
    pause_before = "10s"
    timeout      = "10s"
  }
}
