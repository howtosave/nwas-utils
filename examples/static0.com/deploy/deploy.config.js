
const path = require('path');

const _LOCAL = true;

const svcUser = !_LOCAL ? 'jcsvc00' : 'svc00';
const devUser = !_LOCAL ? 'jcdev00' : 'peterk';
const remote = !_LOCAL ? '211.218.126.148"' : '127.0.0.1';

const repoDir = `/home/${devUser}/static0-release`;
const svcDir = `/home/${svcUser}/static0-service`;

const nginxBaseDocDir = `/home/${svcUser}/static0-service/current/public`;
const nginxBaseLogDir = `/home/${svcUser}/static0-service/log/nginx`;

const outputFile = 'release-static0.tar';

module.exports = {
  svcUser,
  devUser,
  remote,
  repoDir,
  svcDir,

  tar: {
    src: {
      // absolute path of project directory
      baseDir: path.join(__dirname, '..'),
      files: [
        'public',
        'deploy',
        'ecosystem.config.js',
      ]
    },
    output: outputFile,
  },

  scp: {
    server: `${devUser}@${remote}`,
    dest: '/tmp',
    files: [
      outputFile,
    ]
  },

  nginx: {
    docDir: `${nginxBaseDocDir}`,
    logDir: `${nginxBaseLogDir}`,
  },

  script: {
    server: `${devUser}@${remote}`,
    cwd: repoDir,
    cmds: 
`#!/bin/bash

# go to repoDir
cd ${repoDir}

# when git is dirty, exit with 1
if [ "$(git status -s)" != "" ]; then
  echo git is DIRTY !!!
  echo *CLEANUP* first...
  exit 1
fi

# untar
echo --- untar release.tar...
tar -xvf /tmp/${outputFile} -C ./

# git commit
echo --- release checkout...
if [ $(git symbolic-ref --short HEAD) != "release" ]; then
  git checkout release
fi
echo --- commit new release...
if [ "$(git status -s)" != "" ]; then
  git add -A
  git commit -m "by nwas-deploy"
fi

# pm2 deploy
echo --- pm2 deploy...
if [ ! -d "${svcDir}/production" ]; then
  pm2 deploy ecosystem.config.js production setup
fi

pm2 deploy ecosystem.config.js production update --force


#`,
  }
};
