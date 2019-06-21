
// enable 'debug' log
process.env.DEBUG = '*';

//exports.default = require('./tasks/tar');
exports.tar = require('./tasks/tar');
exports.scp = require('./tasks/scp');
exports.script = require('./tasks/script');
