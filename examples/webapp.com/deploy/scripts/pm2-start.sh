#!/bin/bash

APP="$1"

if [ "$APP" == "" ]; then
  pm2 start ecosystem.config.js
else
  pm2 start ecosystem.config.js --only $APP
fi
