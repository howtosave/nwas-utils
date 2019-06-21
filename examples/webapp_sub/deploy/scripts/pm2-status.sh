#!/bin/bash

CMD=$1

if [ "$CMD" == "a" ]; then
  # status
  pm2 status
elif [ "$CMD" == "d" ]; then
  # delete all from list
  pm2 delete ecosystem.config.js
else
  if [ "$CMD" == "" ]; then
    pm2 status
  else
    pm2 show $CMD
  fi
fi
