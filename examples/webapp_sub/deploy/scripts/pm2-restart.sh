#!/bin/bash

APP="$1"

if [ "$APP" == "" ]; then
  pm2 restart ecosystem.config.js
else
  pm2 restart ecosystem.config.js --only $APP
fi
