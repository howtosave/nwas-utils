#!/bin/bash

# script file directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# nginx config file
CONFIG_FILE=$SCRIPT_DIR/nginx-site.conf

# add to enabled sites
sudo ln -sfn $CONFIG_FILE /etc/nginx/sites-enabled/webapp

#
# check nginx conf
sudo nginx -t
# reload nginx
if [ "$?" == "0" ]; then
  # reload nginx
  sudo systemctl reload nginx
  # print status
  systemctl status nginx.service
else
    echo "NginX Config Error: $?"
fi
