/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const { spawn } = require('child_process');

const d = require('debug')('script');

const { parseArgs } = require('../../utils/parse-args');
const { onChildProcessExit } = require('../../utils/on-child-proc-exit');

const task = async (done) => {
  const { script } = parseArgs(process.argv);
  const { server, cmds } = script;

  d(`script on ${server}`);

  try {
    /*
    const child = spawn('ssh', [
      server,
      `'cd ${rcwd} && ${cmds.join(' && ')}'`,
    ], {
      process.cwd(),
    }); */
    const child = spawn(`echo '${cmds}' | ssh ${server} "cat > /tmp/nwas-script && /bin/bash /tmp/nwas-script"`,
      {
        shell: '/bin/bash',
        //stdio: ['pipe', 'inherit', 'pipe'] // stdin, stdout, stderr
        stdio: [process.stdin, process.stdout, process.stderr] // stdin, stdout, stderr
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
