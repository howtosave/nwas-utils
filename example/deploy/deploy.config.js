
const path = require('path');

const {
  when_git_dirty_all, git_checkout_release, git_add_all_and_commit, when_not_release_branch
} = require('./script_cmds');

const _LOCAL = true;

const svcUser = !_LOCAL ? 'jcsvc00' : 'svc00';
const devUser = !_LOCAL ? 'jcdev00' : 'peterk';
const remote = !_LOCAL ? '211.218.126.148"' : '127.0.0.1';

const repoDir = `/home/${devUser}/example-release`;
const svcDir = `/home/${svcUser}/example-service`;

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
        'src',
        'public',
        'deploy',
        '.env',
        '.gitignore',
        'package.json',
        'package-lock.json',
        'yarn.lock',
        'ecosystem.config.js',
      ]
    },
    output: 'release.tar',
  },

  scp: {
    server: `${devUser}@${remote}`,
    // *IMPORTANT*
    // make sure the dest directory exists on the remote
    dest: '/tmp',
    files: [
      'release.tar',
    ]
  },

  script: {
    server: `${devUser}@${remote}`,
    cwd: repoDir,
    cmds: 
`#!/bin/bash    
# go to repoDir
cd ${repoDir}
echo $PWD
# when git is dirty, exit with 1
if [ "$(git status -s)" != "" ]; then
  echo git is DIRTY !!!
  echo *CLEANUP* first...
  exit 1
fi
# untar
echo --- untar release.tar...
tar -xvf /tmp/release.tar -C ./

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
