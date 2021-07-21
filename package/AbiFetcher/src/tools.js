const Chalk = require('chalk');

const MESSAGE_PREFIX = '[@wormhole-stc/abi-fetcher] -- ';
const ErrorMessage = (message) => Chalk.red(`${MESSAGE_PREFIX}${message}`);
const SuccessMessage = (message) => Chalk.green(`${MESSAGE_PREFIX}${message}`);
const CONFIG_FILE_NAME = 'abi-fetcher.config.js';
const SPLIT_SYMBOL = '::';
const CONNECTOR = '_abi_';

module.exports = {
  ErrorMessage,
  SuccessMessage,
  CONFIG_FILE_NAME,
  MESSAGE_PREFIX,
  SPLIT_SYMBOL,
  CONNECTOR,
};
