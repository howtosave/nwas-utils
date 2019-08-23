
const path = require('path');
const fs = require('fs');

function getConfigFile(configFile) {
  const cwd = process.cwd(); // console working directory
  const configPath = path.isAbsolute(configFile) 
    ? configFile
    : path.join(cwd, configFile);
  return fs.existsSync(configPath) ? configPath : null;
}

function getTaskGroupConfig(taskGroupName, config) {
  // check whether config has 'tasks' property
  // 'tasks': {
  //   'deploy': {...}
  // }
  if (config.hasOwnProperty('tasks')) {
    const { tasks } = config;
    if (tasks.hasOwnProperty(taskGroupName)) {
      const taskConfigInfo = tasks[taskGroupName];
      Object.entries(taskConfigInfo).forEach(([key, value]) => {
        // value type이 'string'인 경우에만 config에서 값을 참조함
        taskConfigInfo[key] = (typeof value === 'string') ? config[value] : value;
      });
      return taskConfigInfo;
    }
  }

  // check whether config has taskName property
  // [taskGroupName]: {
  //   'tar': {...},
  //   'scp': {...}
  // }
  if (config.hasOwnProperty(taskGroupName)) {
    const taskConfigInfo = config[taskGroupName];
    return taskConfigInfo;
  }

  // 
  // {
  //    'tar': {...},
  //    'scp': {...}
  // }
  return config;
}

function getTasksConfig(tasks, config) {
  const taskConfig = {};
  tasks.forEach(name => {
    taskConfig[name] = config[name];
  })
  return taskConfig;
}

module.exports = {
  getConfigFile,
  getTaskGroupConfig,
  getTasksConfig,
}
