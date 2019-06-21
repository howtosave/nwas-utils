#!/bin/bash

NWAS_DEPLOY_DIR='../'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CONFIG_FILE=${SCRIPT_DIR}/../deploy.config.js

pushd ${NWAS_DEPLOY_DIR}
#
# do gulp tasks
#
function TMP() {
# tar
gulp tar --config $CONFIG_FILE
if [ "$?" != "0" ]; then
  echo ""
  echo "!!! TAR error"
  echo ""
  exit 1
fi
echo "========================================================="

# upload 
gulp scp --config $CONFIG_FILE
if [ "$?" != "0" ]; then
  echo ""
  echo "!!! UPLOAD error"
  echo ""
  exit 1
fi
echo "========================================================="
}
# untar and commit
gulp script --config $CONFIG_FILE
if [ "$?" != "0" ]; then
  echo ""
  echo "!!! SCRIPT error"
  echo ""
  exit 1
fi
echo "========================================================="


popd
