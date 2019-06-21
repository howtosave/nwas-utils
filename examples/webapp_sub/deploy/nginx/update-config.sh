#!/bin/bash

# script file directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# nginx config file
UPSTREAM_CONFIG_FILE=$SCRIPT_DIR/upstream.conf
LOCATION_CONFIG_FILE=$SCRIPT_DIR/location.conf

# conf.d directory
UPSTREAMS_DIR="/etc/nginx/conf.d/webapp.com/upstreams"
LOCATIONS_DIR="/etc/nginx/conf.d/webapp.com/locations"

# add to conf.d
if [ ! -d "$UPSTREAMS_DIR" ]; then
  sudo mkdir -p $UPSTREAMS_DIR
fi
sudo ln -sfn $UPSTREAM_CONFIG_FILE $UPSTREAMS_DIR/webapp_sub.conf

if [ ! -d "$LOCATIONS_DIR" ]; then
  sudo mkdir -p $LOCATIONS_DIR
fi
sudo ln -sfn $LOCATION_CONFIG_FILE $LOCATIONS_DIR/webapp_sub.conf

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
