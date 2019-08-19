/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const d = require('debug')('generage-config');
//const parseArgs = require('../utils/parse_args');

const cwd = process.cwd(); // console working directory
const cd = __dirname; // current directory


const configTemplateFileName = 'config.template';
const configFileName = 'nwas-deploy.example.config.js';

const task = async (done) => {
  d("Generating an example config file");
  // read template file  
  const fi = fs.readFileSync(path.join(cd, configTemplateFileName));
  //
  const compiled = _.template(fi);
  // write compiled content
  fs.writeFileSync(path.join(cwd, configFileName), compiled());

  done();
};

module.exports = task;
