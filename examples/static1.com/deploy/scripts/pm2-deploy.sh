#!/bin/bash

ENV="$1"

# create the folders on your remote server
pm2 deploy ecosystem.nitrogen.config.js "$ENV" setup

# Deploy your code
pm2 deploy ecosystem.nitrogen.config.js "$ENV" --force

