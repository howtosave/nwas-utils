/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */

const GHPages = require('gh-pages');
const d = require('debug')('ghPages');

const { parseArgs } = require('../../utils/parse-args');

const task = (done) => {
  try {
    const { ghPages } = parseArgs(process.argv);
    const { publicDir, repo, destDir } = ghPages;
  
    d(`upload ${publicDir} to ${repo}`);
    
    const options = {
      src: "**/*", //  minimatch pattern or array of patterns used to select which files should be published
      branch: "gh-pages", // The name of the branch you'll be pushing to.
      repo: repo,
      dest: destDir || ".", //destination folder
      dotfiles: false, // ignore dot(.*) files
      add: false, // remove the existing files before adding new version
    }

    GHPages.publish(publicDir, options, (err) => {
      if (!err) d('DONE.');
      done(err);
    });

  } catch (e) {
    console.error(e);
    done(e);
  }
};

module.exports = task;
