/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const { spawn } = require('child_process');

const d = require('debug')('script');

const parseArgs = require('../utils/parse_args');

const cwd = process.cwd(); // console working directory

const task = (done) => {
  const args = parseArgs(process.argv);
  const { config: configFile } = args;
  const { script } = require(configFile);
  //d(tar);
  const { server, cwd: rcwd, cmds } = script;

  d(`script on ${server}:${rcwd}`);

  //const cmdsTxt = `'cd ${rcwd} && ${cmds.join(' && ')}'`;
  //d(`script: ${cmdsTxt}`);

  try {
    /*
    const child = spawn('ssh', [
      server,
      cmdsTxt,
    ], {
      cwd,
    }); */
    const child = spawn(`echo ${cmds} | ssh ${server} "cat > /tmp/script && /bin/bash /tmp/script"`,
      { 
        cwd, 
        shell: true,
        stdio: ['pipe', 'inherit', 'pipe'] // stdin, stdout, stderr
      });

    // stdout    
    // 'inherit' causes child.stdout is null

    // stderr
    child.stderr.on('data', (data) => {
      // TODO:
      // DO NOT EXIT PROCESS WHEN THROWING EXCEPTION WHILE INPUT PASSWORD
      console.error(`ERR: ${data}`);
      throw new Error(`${data}`);
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
