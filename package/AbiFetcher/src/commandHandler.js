const path = require('path');
const fs = require('fs-extra');
const abiFetcher = require('./fetcher');
const { SuccessMessage, ErrorMessage, CONFIG_FILE_NAME } = require('./tools');

/**
 * Init config file
 */
const init = () => {
  const confirFile = path.resolve(CONFIG_FILE_NAME);
  if (!fs.existsSync(confirFile)) {
    fs.copySync(path.resolve(__dirname, '../config/' + CONFIG_FILE_NAME), confirFile);
    console.log(SuccessMessage('Config file created.'));
  } else {
    console.log(ErrorMessage(`${confirFile} already exists`));
  }
};

/**
 * Fetch Abi config
 */
const run = () => {
  const { modules } = require(path.resolve(CONFIG_FILE_NAME));
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
