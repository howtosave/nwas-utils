/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const { spawn } = require('child_process');

const d = require('debug')('dbrestore');

const parseArgs = require('../utils/parse_args');

const cwd = process.cwd(); // console working directory

const task = (done) => {
  const args = parseArgs(process.argv);
  const { config } = args;
  const configFile = path.join(cwd, config);
  const { dbrestore } = require(configFile);

  const { server, dbhost, user, password, dbname, collections, inDir } = dbrestore;

  d(`dbrestore on ${server} ${dbhost}/${dbname} ${collections}`);

  try {
    let cmd = `mongorestore --host ${dbhost} --db ${dbname} --dir ${inDir}`;
    if ( user ) cmd += ` -u ${user} -p ${password}`;
    if ( collections && collections.length > 0 ) {
      let cmds = [];
      collections.forEach(function(col) {
        cmds.push(`${cmd} --collection ${col}`);
      });
      cmd = cmds.join('\n');
    }
    const child = spawn(`echo '${cmd}' | ssh ${server} "cat - > /tmp/nwas-dbrestore && /bin/bash /tmp/nwas-dbrestore"`,
      {
        shell: '/bin/bash',
        stdio: ['pipe', 'inherit', 'pipe'] // stdin, stdout, stderr
      });

    // stdout    
    // 'inherit' causes child.stdout is null

    // stderr
    child.stderr.on('data', (data) => {
      // TODO:
      // DO NOT EXIT PROCESS WHEN THROWING EXCEPTION WHILE INPUT PASSWORD
      console.error(`! ${data}`);
      //throw new Error(`${data}`);
    });

    // event handler
    child.on('exit', function (code, signal) {
      if (code === 0) {
        d('DONE');
        done();
      } else {
        done(new Error('Exit with error code: ' + code));
      }
    });
  } catch (e) {
    console.error(e);
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
