/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
//const util = require('util');
const { spawn } = require('child_process');

const d = require('debug')('scp');

const { parseArgs } = require('../../utils/parse-args');
const { onChildProcessExit } = require('../../utils/on-child-proc-exit');

const cwd = process.cwd(); // console working directory


const task = async (done) => {
  let child;
  try {
    const { scp } = parseArgs(process.argv);
    const { server, dest, files } = scp;
  
    d(`upload to ${server}:${dest}`);
    d('files: ', files.join(' '));

    child = spawn('scp', [
      ...files,
      `${server}:${dest}`,
    ], {
      cwd,
      //stdio: ['pipe', 'pipe', 'pipe'] // stdin, stdout, stderr
      stdio: [process.stdin, process.stdout, process.stderr]
    });
    // stdout : 'ignore' causes child.stdout is null

    await onChildProcessExit(child);

    d('DONE.');
    done();
  } catch (e) {
    if (!child.killed) {
      // pause and kill script
      //child.stdin.pause();
      //child.stdin.end();
      child.kill();
    }
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
