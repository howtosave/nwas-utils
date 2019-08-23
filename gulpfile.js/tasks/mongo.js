/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const _ = require('lodash');

const d = require('debug')('mongo');

const { parseArgs } = require('../../utils/parse-args');
const { onChildProcessExit } = require('../../utils/on-child-proc-exit');

const cd = __dirname;
const templateFileName = 'mongo.template.js';

const task = async (done) => {
  const { mongo } = parseArgs(process.argv);
  const { server, dbhost, adminUser, adminPassword, dbname, addUsers } = mongo;

  d(`mongo on ${server} ${dbhost}/${dbname}`);

  const templateFilePath = path.join(cd, templateFileName);
  const compiled = _.template(fs.readFileSync(templateFilePath));
  d('addUsers', addUsers);
  const shellScript = compiled({
    dbhost,
    adminUser,
    adminPassword,
    dbname,
    addUsers: (addUsers && addUsers.enabled) ? addUsers.data : [],
  });
  try {
    const child = spawn(`echo '${shellScript}' | ssh ${server} "cat - > /tmp/nwas-mongo.js && /usr/bin/mongo --nodb /tmp/nwas-mongo.js"`,
      {
        shell: '/bin/bash',
        //stdio: ['pipe', 'inherit', 'pipe'] // stdin, stdout, stderr
        stdio: [process.stdin, process.stdout, process.stderr]
      });

    await onChildProcessExit(child);

    d('DONE.');
    done();
  } catch (e) {
    console.error(e);
    done(e);
  }
};

module.exports = task;

/**
 * Node.js Child Process
 * REF: https://zaiste.net/nodejs-child-process-spawn-exec-fork-async-await/
 * 
 * # spawn
 * spawn launches a command in a new process:
 * 
const { spawn } = require('child_process')
const child = spawn('ls', ['-a', '-l']);
 * 
 * spawn returns a ChildProcess object.
 * As ChildProcess inherits from EventEmitter you can register handlers for events on it.
 * 
child.on('exit', code => {
  console.log(`Exit code is: ${code}`);
});
 * 
 *
 * # exec
 * exec creates a shell to execute the command.
 * Thus, it's possible to specify the command to execute using the shell syntax.
 * 
const { exec } = require('child_process')
const child = exec('find . -type f | wc -l');
 * 
 * 
 * # fork
 * fork is a variation of spawn where both the parent/caller and 
 * the child process can communicate with each other via send().
 * 
 * Thanks to fork, computation intensive tasks can be separated from the main event loop.
 * 
 */
