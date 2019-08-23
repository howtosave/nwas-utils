/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const d = require('debug')('dbrestore');

const { parseArgs } = require('../../utils/parse-args');
const { onChildProcessExit } = require('../../utils/on-child-proc-exit');

const task = async (done) => {
  const { dbrestore } = parseArgs(process.argv);
  const { server, dbhost, user, password, dbname, upsertColls, restoreColls, dropColls, inDir } = dbrestore;

  d(`dbrestore on ${server} ${dbhost}/${dbname} ${upsertColls} ${restoreColls}`);

  try {
    // input options:
    // --objcheck : validate all objects before inserting
    //
    // restore options:
    // --drop : drop each collection before import
    // 
    // upsert options:
    // --upsert: merge the records

    let cmds = [];
    //
    // collections to be restored
    if ( restoreColls && restoreColls.length > 0 ) {
      let cmd = `mongorestore --host ${dbhost} --db ${dbname} --objcheck`;
      if ( user ) cmd += ` -u ${user} -p ${password}`;
      restoreColls.forEach(function(coll) {
        // coll[0]: collection name
        // coll[1]: restore options
        const backupFilePath = path.join(inDir,`${coll[0]}.bson`);
        if (!fs.existsSync(backupFilePath)) return;

        cmds.push(`${cmd} --collection ${coll[0]} --dir ${backupFilePath} ${coll[1]}`);
      });
    }

    //
    // collections to be updated or inserted
    if ( upsertColls && upsertColls.length > 0 ) {
      // TODO: implement upsert (eg. remove and insert the records)
      let cmd = `mongorestore --host ${dbhost} --db ${dbname} --objcheck`;
      if ( user ) cmd += ` -u ${user} -p ${password}`;
      upsertColls.forEach(function(coll) {
        // coll[0]: collection name
        // coll[1]: import options
        const backupFilePath = path.join(inDir,`${coll[0]}.bson`);
        if (!fs.existsSync(backupFilePath)) return;

        cmds.push(`${cmd} --collection ${coll[0]} --dir ${backupFilePath} ${coll[1]}`);
        //cmds.push(`${cmd} --collection ${coll[0]} --dir ${backupFilePath}`);
      });
    }

    //
    // collections to be droped
    if ( dropColls && dropColls.length > 0 ) {
      // TODO: implement upsert (eg. remove and insert the records)
      let cmd = `mongorestore --host ${dbhost} --db ${dbname} --drop`;
      if ( user ) cmd += ` -u ${user} -p ${password}`;
      dropColls.forEach(function(coll) {
        // coll[0]: collection name
        // coll[1]: import options
        const backupFilePath = path.join(inDir,`empty.bson`);
        if (!fs.existsSync(backupFilePath)) return;

        cmds.push(`${cmd} --collection ${coll[0]} ${coll[1]} --dir ${backupFilePath}`);
      });
    }

    //
    // collections to be droped

    if (cmds.length === 0) {
      let cmd = `mongorestore --host ${dbhost} --db ${dbname} --dir ${inDir} --objcheck`;
      if ( user ) cmd += ` -u ${user} -p ${password}`;
      cmds.push[cmd];
    }

    // run commands
    let cmd = cmds.join('\n');
    const child = spawn(`echo '${cmd}' | ssh ${server} "cat - > /tmp/nwas-dbrestore && /bin/bash /tmp/nwas-dbrestore"`,
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
