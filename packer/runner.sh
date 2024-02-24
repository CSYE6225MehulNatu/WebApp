#! /bin/bash

sudo chown -R csye6225:csye6225 /opt/csye6225/webapp/
sudo chmod -R 750 /opt/csye6225/webapp/

echo "Moving webAppService to systemd path"
sudo cp /tmp/WebappService.service /etc/systemd/system/WebappService.service

echo "Running service"
sudo systemctl daemon-reload
sudo systemctl enable WebappService
sudo systemctl start WebappService
sudo systemctl status WebappService

sudo systemctl start mysqld
sudo systemctl enable mysqld

echo "Checking if '$DB_DATABASE' database exists..."
DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE '$DB_DATABASE';" | grep "$DB_DATABASE" > /dev/null; echo "$?")
if [ "$DB_EXISTS" -eq 1 ]; then
    echo "Database does not exist. Creating now..."
    mysql -u root -e "CREATE DATABASE $DB_DATABASE;"
    echo "Database '$DB_DATABASE' created."
else
    echo "Database '$DB_DATABASE' already exists."
fi


