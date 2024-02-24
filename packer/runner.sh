#! /bin/bash

if [ -f /opt/csye6225/webapp/.env ]; then
    echo "Loading environment variables from .env file..."
    # set -a # automatically export all variables
    # shellcheck disable=SC1091
    source /opt/csye6225/webapp/.env
    cat /opt/csye6225/webapp/.env
    #set +a
    echo "Environment variables loaded:"
    echo "DB_DATABASE=$DB_NAME"
    echo "DB Name = $DB_DATABASE"
else
    echo ".env file not found, ensure it exists at /opt/csye6225/webapp/.env"
    exit 1
fi

mysql -u root -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

echo "Checking if '$DB_NAME' database exists..."
DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE '$DB_NAME';" | grep "$DB_NAME" > /dev/null; echo "$?")
if [ "$DB_NAME" -eq 1 ]; then
    echo "Database does not exist. Creating now..."
    mysql -u root -e "CREATE DATABASE $DB_NAME;"
    echo "Database '$DB_NAME' created."
else
    echo "Database '$DB_NAME' already exists."
fi

sudo chown -R csye6225:csye6225 /opt/csye6225/webapp/
sudo chmod -R 750 /opt/csye6225/webapp/

echo "Moving webAppService to systemd path"
sudo cp /tmp/WebappService.service /etc/systemd/system/WebappService.service

echo "Running service"
sudo systemctl daemon-reload
sudo systemctl enable WebappService
sudo systemctl start WebappService
sudo systemctl status WebappService
sudo systemctl restart WebappService



