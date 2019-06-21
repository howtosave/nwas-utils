#!/bin/bash

CONF_FILE=$PWD/deploy/nginx-site-local.conf

# make directories
#mkdir -p $PWD/temp-deploy/log/nginx

# add to enabled sites
sudo ln -sfn $CONF_FILE /etc/nginx/sites-enabled/example

#
# check nginx conf
sudo nginx -t

if [ "$?" -eq "0" ]; then
  # restart nginx
  # reload nginx
  sudo systemctl reload nginx
  # print status
  systemctl status nginx.service
else
    echo "NginX Config Error: $?"
fi

