#!/bin/bash

pushd static0.com
bash ./deploy/start.sh
popd

pushd static1.com
bash ./deploy/start.sh
popd

pushd webapp.com
bash ./deploy/start.sh
popd

pushd webapp_sub
bash ./deploy/start.sh
popd

