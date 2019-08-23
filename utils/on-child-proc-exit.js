
function onChildProcessExit(child) {
  return new Promise((resolve, reject) => {
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error('Exit with error, ' + code));
    });

    child.once('error', err => {
      reject(err);
    });
  });
}

module.exports = {
  onChildProcessExit,
}
