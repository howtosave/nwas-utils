#!/usr/bin/env node
const _ = require('lodash');
const { showHelp, parseArgs, setTasksConfig, getArgv } = require('./utils/parse-args');

//
// get config for tasks
//
let tasksConfig = parseArgs();

if (!tasksConfig || _.isEmpty(tasksConfig)) {
  console.log('!!! No task specified');
  console.log('');
  showHelp();
  console.log('');
  process.exit(1);
}

//
// 개별 task들에서 parseArgs() 함수를 통해 tasksConfig를 
// 참조할 수 있도록 setTasksConfig()를 통해 저장함
//
setTasksConfig(tasksConfig);

//
// run tasks
// 
const argv = getArgv();
let runInParallel = (tasksConfig['series'] !== undefined) ? !tasksConfig['series'] : true;
// override by the value in command line
runInParallel = (argv.series !== undefined) 
  ? !argv.series
  : (argv.parallel !== undefined)
  ? argv.parallel 
  : runInParallel;

const taskNames = Object.keys(tasksConfig);

//console.log('>>> task config', tasksConfig);
console.log('>>> run in parallel', runInParallel);

const gulp = require('gulp');
const availableGulpTasks = require('./gulpfile.js');
let gulpTasks = [];
taskNames.forEach(name => {
  availableGulpTasks[name] && gulpTasks.push(availableGulpTasks[name]);
});

//console.log('tasks', gulpTasks);

const build = (runInParallel) 
  ? gulp.parallel.apply(gulp, gulpTasks)
  : gulp.series.apply(gulp, gulpTasks);

build(function(err) {
  if (err) {
    console.log("!!! Error while running tasks", err);
    process.exit(1);
  }
});

module.exports = () => {
  console.log('run nwas-deploy...');
};
