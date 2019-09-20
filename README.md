# NWAS Utils

## Setup

```sh
# install glup-cli to global
npm install --global gulp-cli
# install gulp to local directory
yarn add --dev gulp
# verify
gulp --version
```

## Configuration

See [./sample.config.js](./sample.config.js)

## Usage

```sh
NWAS=/path/to/nwas-utils
node $NWAS --config /path/to/config-file --task task_name
```
