
const path = require('path');
const cd = __dirname; // config file directory
const tarOutput = path.join(cd, 'output.tar');

module.exports = {
  tasks: {
    'staging': {
      series: true,
      //tar: 'tar1',
      //scp: 'scp',
      script: 'script',
    }
  },
  tar1: {
    // absolute file path
    output: tarOutput,

    input: {
      // base directory for the input files
      baseDir: './',

      // files to be tar
      files: [
        'package.json'
      ],

      // path pattern to be excluded
      excludes: [
        "*.tar"
      ]
    }
  },

  scp: {
    // destination server
    server: `peterk@myserver.com`,

    // absolute file paths to be uploaded
    files: [
      tarOutput,
    ],

    // destination folder on the server
    // make sure the destination directory exists on the server
    dest: '/tmp',
  },

  script: {
    // destination server
    server: `peterk@localhost`,

    // commands to be run on the remote server
    cmds: 'ls -al'
  }
}
