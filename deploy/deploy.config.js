
const path = require('path');

const {
  when_git_dirty_all, git_checkout_release, git_add_all_and_commit
} = require('./script_cmds');

const _LOCAL = true;

const svcUser = !_LOCAL ? 'jcsvc00' : 'svc00';
const devUser = !_LOCAL ? 'jcdev00' : 'peterk';
const remote = !_LOCAL ? 'jcdev00@211.218.126.148"' : 'peterk@127.0.0.1';

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
    server: remote,
    // *IMPORTANT*
    // make sure the dest directory exists on the remote
    dest: '/tmp',
    files: [
      'release.tar',
    ]
  },

  script: {
    server: remote,
    cwd: repoDir,
    cmds: [
      // when git is dirty, exit with 1
      `${when_git_dirty_all} || { echo !!! git is *DIRTY*! *CLEANUP* first...; false; }`,
      // untar
      '{ echo --- untar release.tar...; tar -xvf /tmp/release.tar -C ./; }',
      // git commit
      `{ echo --- release checkout...; ${git_checkout_release}; }`,
      `{ echo --- commit new release...; ${git_add_all_and_commit}; }`,
      // pm2 deploy
      //`{ echo --- pm2 deploy...; pm2 deploy ecosystem.config.js production update --force; }`,
    ],
  }
};
