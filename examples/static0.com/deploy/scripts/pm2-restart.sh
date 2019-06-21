#!/bin/bash

APP="$1"

if [ "$APP" == "" ]; then
  pm2 restart ecosystem.nitrogen.config.js
else
  pm2 restart ecosystem.nitrogen.config.js --only $APP
fi
