#!/bin/bash

echo "Initializing dnf"
sudo dnf upgrade

echo "Installing unzip"
sudo dnf install unzip -y

echo "Installing node"
sudo dnf install -y curl
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

sudo groupadd csye6225
sudo useradd csye6225 -s /usr/sbin/nologin -g csye6225

echo "Unziping webapp"
sudo mkdir /opt/csye6225
sudo cp /tmp/webapp.zip /opt/csye6225/webapp.zip


echo "$PWD"
cd /opt/csye6225 || exit
sudo mkdir webapp
sudo unzip -q webapp.zip -d webapp

echo "Removing webapp zip file"
sudo rm /opt/csye6225/webapp.zip

cd /opt/csye6225/webapp/ || exit

echo "Listing directory"
#echo "$PWD"
#echo "$LS"
#sudo ls

echo "Installing node modules"
sudo npm ci
sudo npm install sequelize
sudo npm install mysql2


if [ -f /opt/csye6225/webapp/.env ]; then
    echo "Loading environment variables from .env file..."
    set -a # automatically export all variables
    # shellcheck disable=SC1091
    source /opt/csye6225/webapp/.env
    set +a
    echo "Environment variables loaded:"
    echo "DB_DATABASE=$DB_NAME"
else
    echo ".env file not found, ensure it exists at /opt/csye6225/webapp/.env"
    exit 1
fi


echo "Installing MySQL server"
sudo dnf install -y mysql-server


