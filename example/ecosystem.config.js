/**
 * Created by peterk on 11/28/16.
 */
const { svcUser, repoDir: repoUrl, svcDir } = require('./deploy/deploy.config');

const prod_post_deploy = [
  // current link directory를 생성한다. (nginx와 같은 다른 설정 파일에서 사용됨)
  'ln -sfn $PWD/../current ../../current',
  'npm install --production',
  'pm2 startOrRestart ecosystem.nitrogen.config.js --env production'
];

const dev_post_deploy = [
  'ln -sfn $PWD/../current ../../current',
  'npm install --development',
  'pm2 startOrRestart ecosystem.nitrogen.config.js --env development'
];

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "example",
      script: "./src/server.js",
      instances: "1",
      exec_mode: "cluster",
      env: {
        COMMON_VARIABLE: "true",
      },
      env_production: {
        NODE_ENV: "production"
      },
      log_date_format: 'YYYY-MM-DD HH:mm',
      error_file: `${svcDir}/log/prod/pm2/nitrogen-error.log`,
      out_file: `${svcDir}/log/prod/pm2/nitrogen-access.log`
    }
  ],

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
      env: {
        NODE_ENV: "production"
      }
    },

    dev: {
      user: svcUser,
      host: "127.0.0.1",
      ref: "origin/master",
      repo: repoUrl,
      path: `${svcDir}/development`,
      "pre-setup": `mkdir -p ${svcDir}/log/nginx`,
      "post-deploy": dev_post_deploy.join(" && "),
      env: {
        NODE_ENV: "development"
      }
    }
  }
};
