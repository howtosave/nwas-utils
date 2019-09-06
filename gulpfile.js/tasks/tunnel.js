/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const { spawn } = require('child_process');

const d = require('debug')('tunnel');

const { parseArgs } = require('../../utils/parse-args');
const { onChildProcessExit } = require('../../utils/on-child-proc-exit');

const task = async (done) => {
  const { tunnel } = parseArgs(process.argv);
  const { localPort, remotePort, server } = tunnel;

  d(`tunnel on ${server}:${remotePort} ==> localhost:${localPort}`);

  try {
    /*
    const child = spawn('ssh', [
      server,
      `'cd ${rcwd} && ${cmds.join(' && ')}'`,
    ], {
      process.cwd(),
    }); */
    const child = spawn(`ssh -L ${localPort}:localhost:${remotePort} ${server}`,
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
