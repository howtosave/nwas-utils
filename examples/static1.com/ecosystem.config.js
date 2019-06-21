/**
 * Created by peterk on 11/28/16.
 */
const { svcUser, repoDir: repoUrl, svcDir } = require('./deploy/deploy.config');

const prod_post_deploy = [
  'ln -sfn $PWD ../../current',
];

const dev_post_deploy = [
  'ln -sfn $PWD ../../current',
];

module.exports = {
  // no apps
  apps: [],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: svcUser,
      host: "127.0.0.1",
      ref: "origin/release",
      repo: repoUrl,
      path: `${svcDir}/production`,
      "pre-setup": `mkdir -p ${svcDir}/log/nginx`,
      "post-deploy": prod_post_deploy.join(" && "),
    },

    dev: {
      user: svcUser,
      host: "127.0.0.1",
      ref: "origin/master",
      repo: repoUrl,
      path: `${svcDir}/development`,
      "pre-setup": `mkdir -p ${svcDir}/log/nginx`,
      "post-deploy": dev_post_deploy.join(" && "),
    }
  }
};
