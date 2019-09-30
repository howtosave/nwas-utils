/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
//const util = require('util');
const { spawn } = require('child_process');

const d = require('debug')('tar');
const { parseArgs } = require('../../utils/parse-args');

function parseExclude(input) {
  const excludes = [];
  if (input.excludes) {
    if (Array.isArray(input.excludes)) {
      for (const excl of input.excludes) {
        excludes.push('--exclude');
        excludes.push(excl);
      }
    } else {
      excludes.push('--exclude');
      excludes.push(input.excludes);
    }
  }
  return excludes;
}

async function doTar(output, curInput, append) {
  d('workingDir: ', curInput.baseDir);

  let child = spawn('tar', [
    append ? '-rf' : '-cf',
    output,
    ...parseExclude(curInput),
    ...curInput.files,
  ], {
    cwd: curInput.baseDir,
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
}

const task = async (done) => {
  try {
    const { tar } = parseArgs(process.argv);
    const { input, output } = tar;
  
    let inputArr = Array.isArray(input) ? input : [input];
    
    // create the tar
    await doTar(output, inputArr[0], false);

    // append the rest to the existing tar file.
    for (let i = 1; i < inputArr.length; i++) {
      await doTar(output, inputArr[i], true);
    }

    d('DONE.', output);
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
