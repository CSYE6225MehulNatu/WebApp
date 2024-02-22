packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.0.0, < 2.0.0"
    }
  }
}

/*
variable "account_file" {
  type    = string
  default = env("GOOGLE_APPLICATION_CREDENTIALS")
}
*/

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

source "googlecompute" "csye6225-webapp-custom-image" {
  project_id              = var.project_id
  source_image_family     = var.source_image_family
  zone                    = var.zone
  disk_size               = var.disk_size
  disk_type               = var.disk_type
  image_name              = "csye6225-webapp-{{timestamp}}"
  image_description       = "CSYE 6225 WebApp Image custom"
  image_family            = "csye6225-webapp-image"
  image_project_id        = var.project_id
  image_storage_locations = ["us"]
  ssh_username            = "packer"
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






/*

builders = [
  {
    type = "googlecompute"
    project_id = var.project_id
    source_image_family = var.source_image_family
    credentials_file = var.credentials_file_path
    zone = var.zone
    ssh_username = "packer"
    image_name = "portfolio-web-app-{{timestamp}}"
    image_description = "Web server for portfolio web app."
    image_storage_locations = ["us-central1"]
    service_account_email = "packer-sa@gcp_project.iam.gserviceaccount.com"
  }
]

provisioners = [
  {
    type = "shell"
    inline = ["mkdir -p /var/www/html"]
  },
  {
    type = "file"
    source = "public/"
    destination = "/var/www/html"
  },
  {
    type = "shell"
    script = "deploy.sh"
  }
]

post-processors = [
  {
    type = "vagrant"
  },
  {
    type = "compress"
    output = "portfolio-web-app-vagrant.tar.gz"
  },
  {
    type = "googlecompute-export"
    paths = ["gs://gcs_bucket/portfolio-web-app-vagrant.tar.gz"]
    keep_input_artifact = true
  }
]
*/