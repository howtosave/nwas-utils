/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
//const util = require('util');
const { spawn } = require('child_process');

const d = require('debug')('tar');

const parseArgs = require('../utils/parse_args');

const cwd = process.cwd(); // console working directory

const task = async (done) => {
  const args = parseArgs(process.argv);
  d('args:', args);
  const { config: configFile } = args;
  const { tar } = require(configFile);
  //d(tar);
  const { src } = tar;
  let { output } = tar;

  if (!output) output = 'output.tar';
  if (!output.endsWith('.tar')) output += '.tar';
  output = path.join(cwd, output);
  d('output: ', output);

  try {
    const child = spawn('tar', [
      '-cvf',
      output,
      ...src.files,
    ], {
      cwd: src.baseDir,
    });
    // output log
    for await (const data of child.stdout) {
      console.log(`${data}`);
    }
    // error log
    for await (const data of child.stderr) {
      //console.error(`tar error: ${data}`);
      throw new Error(`${data}`);
    }

    d('DONE!!!', output);
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
