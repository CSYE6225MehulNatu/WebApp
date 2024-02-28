#! /bin/bash
sudo chown -R csye6225:csye6225 /opt/csye6225/webapp/
sudo chmod -R 750 /opt/csye6225/webapp/

echo "Moving webAppService to systemd path"
sudo cp /tmp/WebappService.service /etc/systemd/system/WebappService.service

echo "Running service"
sudo systemctl daemon-reload
sudo systemctl enable WebappService
sudo systemctl start WebappService




