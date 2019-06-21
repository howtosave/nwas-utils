#!/bin/bash

# path for nwas-deploy package
NWAS_DEPLOY_DIR='../../'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CONFIG_FILE=${SCRIPT_DIR}/deploy.config.js

#
# do gulp tasks
#

# tar
$NWAS_DEPLOY_DIR/node_modules/.bin/gulp tar --config $CONFIG_FILE
if [ "$?" != "0" ]; then
  echo ""
  echo "!!! TAR error"
  echo ""
  exit 1
fi
echo "========================================================="

# upload 
$NWAS_DEPLOY_DIR/node_modules/.bin/gulp scp --config $CONFIG_FILE
if [ "$?" != "0" ]; then
  echo ""
  echo "!!! UPLOAD error"
  echo ""
  exit 1
fi
echo "========================================================="

# untar and commit
$NWAS_DEPLOY_DIR/node_modules/.bin/gulp script --config $CONFIG_FILE
if [ "$?" != "0" ]; then
  echo ""
  echo "!!! SCRIPT error"
  echo ""
  exit 1
fi
echo "========================================================="
