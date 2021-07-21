const path = require('path');
const fs = require('fs-extra');
const { SuccessMessage, ErrorMessage, CONFIG_FILE_NAME } = require('./tools');

/**
 * Init config file
 */
const init = () => {
  const configFile = path.resolve(CONFIG_FILE_NAME);
  if (!fs.existsSync(configFile)) {
    fs.copySync(path.resolve(__dirname, '../config/' + CONFIG_FILE_NAME), configFile);
    console.log(SuccessMessage('Config file created.'));
  } else {
    console.log(ErrorMessage(`${configFile} already exists`));
  }
};

/**
 * Fetch Abi config
 */
const run = () => {
  const { modules } = require(path.resolve(CONFIG_FILE_NAME));
  const abiFetcher = require('./fetcher');
  if (Array.isArray(modules)) {
    abiFetcher(modules);
  } else {
    console.log(ErrorMessage('[modules] param in mobius.config.js must be a array!'));
  }
};

module.exports = {
  init,
  run,
};
