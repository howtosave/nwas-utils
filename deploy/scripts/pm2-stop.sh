#!/bin/bash

CMD="$1"

# Stop all
pm2 stop ecosystem.nitrogen.config.js

# delete all from list
if [ "$CMD" == "d" ]; then
  pm2 delete ecosystem.nitrogen.config.js
fi
