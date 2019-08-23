
const yargs = require('yargs')
  .usage('$0 [Options] [task1 task2 ...]')
  .option('config', {
    alias: 'c',
    describe: 'config file',
    demandOption: true,
    type: 'string'
  })
  .option('task', {
    alias: 't',
    describe: 'task to be executed',
    type: 'string'
  })
  .option('series', {
    describe: 'run the tasks sequentially',
    type: 'boolean'
  })
  .option('parallel', {
    describe: 'run the tasks in parallel',
    type: 'boolean'
  })
  .help();

const argv = yargs.argv;
function getArgv() {
  return argv;
}

function showHelp() {
  yargs.showHelp();
}

const getConfig = require('./get-task-config');

function parseArgs() {
  // we already have a tasksConfig
  if (tasksConfig) return tasksConfig;

  //
  // load config
  //
  configFile = getConfig.getConfigFile(argv.config);
  if (!configFile) {
    console.log('');
    console.log('Invalid config file', configFile || argv.config);
    console.log('');
    process.exit(1);
  }

  const config = require(configFile);
  let _tasksConfig = null;
  if (argv.task) {
    _tasksConfig = getConfig.getTaskGroupConfig(argv.task, config);
    //console.log('TASK:', argv.task, taskConfig);
  }
  else if (argv._) {
    _tasksConfig = getConfig.getTasksConfig(argv._, config);
    //console.log('tasks:', argv._, taskConfig);
  }

  return _tasksConfig;
};

let configFile = null;
let tasksConfig = null;

function getConfigFile() {
  return configFile;
}
function setTasksConfig(config) {
  tasksConfig = config;
}

module.exports = {
  showHelp,
  parseArgs,
  getArgv,
  setTasksConfig,
  getConfigFile,
}
