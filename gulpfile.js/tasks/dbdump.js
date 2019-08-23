/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const { spawn } = require('child_process');

const d = require('debug')('dbdump');

const { parseArgs } = require('../../utils/parse-args');
const { onChildProcessExit } = require('../../utils/on-child-proc-exit');

const task = (done) => {
  const { dbdump } = parseArgs(process.argv);
  const { server, dbhost, user, password, dbname, collections, outDir } = dbdump;

  d(`dbdump on ${server} ${dbhost}/${dbname} ${collections}`);

  try {
    let cmd = `mongodump --host ${dbhost} --db ${dbname} --out ${outDir}`;
    if ( user ) cmd += ` -u ${user} -p ${password}`;
    if ( collections && collections.length > 0 ) {
      let cmds = [];
      collections.forEach(function(col) {
        cmds.push(`${cmd} --collection ${col}`);
      });
      cmd = cmds.join('\n');
    }
    const child = spawn(`echo '${cmd}' | ssh ${server} "cat - > /tmp/nwas-dbdump && /bin/bash /tmp/nwas-dbdump"`,
      {
        shell: '/bin/bash',
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
