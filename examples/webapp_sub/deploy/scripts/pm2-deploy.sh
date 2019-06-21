#!/bin/bash

ENV="$1" # production or development

# create the folders on your remote server
pm2 deploy ecosystem.config.js "$ENV" setup

# Deploy your code
pm2 deploy ecosystem.config.js "$ENV" --force

