#!/bin/bash

APP="$1"

# make log directory                                                                                       
mkdir -p temp-deploy/log/production/pm2/

if [ "$APP" == "" ]; then
  pm2 start ecosystem.nitrogen.config.js
else
  pm2 start ecosystem.nitrogen.config.js --only $APP
fi
