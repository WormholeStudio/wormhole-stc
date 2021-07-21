const Chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');

const { providers } = require('@starcoin/starcoin');
const {
  SuccessMessage,
  ErrorMessage,
  CONFIG_FILE_NAME,
  SPLIT_SYMBOL,
  CONNECTOR,
} = require('./tools');

const { providerUrl, output } = require(path.resolve(CONFIG_FILE_NAME));
const { JsonRpcProvider } = providers;

const outputDir = output || path.resolve('./src/abis');

const writeFile = ({ name, data }) => {
  try {
    fs.ensureDirSync(outputDir);
    // Save data into file
    const [address, module, ...res] = name.split(SPLIT_SYMBOL);
    const fileName = `${[
      address.replace(/(\w{6})\w*(\w{4})/, `$1${CONNECTOR}$2`),
      module,
      ...res,
    ].join('::')}.json`;

    fs.outputJSONSync(
      // File path
      path.resolve(outputDir, fileName),
      // Abi Json
      data,
      // format option
      { spaces: 4 },
    );
    return fileName;
  } catch (err) {
    console.log(err);
    return '';
  }
};

const writeIndexFile = (fileData) => {
  try {
    const indexFile = 'index.js';
    fs.ensureDirSync(outputDir);
    fs.outputFileSync(path.resolve(outputDir, indexFile), fileData);
  } catch (err) {
    console.log(err);
  }
};

const moduleValid = (moduleName) => {
  const [address, name] = moduleName.split('::');

  if (typeof address != 'string' || address.indexOf('0x') !== 0 || address.length !== 34) {
    console.log(ErrorMessage(`${address} is not a valid address!`));
    return false;
  }

  if (!name) {
    console.log(ErrorMessage(`${name} is invalid!`));
    return false;
  }
  return true;
};

const fetcher = (modules) => {
  const provider = new JsonRpcProvider(providerUrl || 'https://main-seed.starcoin.org');

  Promise.filter(
    modules.map((module) => {
      if (moduleValid(module)) {
        return provider
          .send('contract.resolve_module', [module])
          .then((data) => {
            return writeFile({
              name: module,
              data,
            });
          })
          .catch((error) => {
            console.log(ErrorMessage(`${error.requestBody}`));
          });
      } else {
        return Promise.resolve('');
      }
    }),
    (item, index) => {
      if (item) {
        return true;
      } else {
        console.log(
          ErrorMessage(
            `module: ${modules[index]} occured an error when creating abi json file. Try again!`,
          ),
        );
        return false;
      }
    },
  )
    .then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        writeIndexFile(
          res
            .map(
              (abiJsonFileName) =>
                `export * as ${abiJsonFileName
                  .replace(/\.json$/, '')
                  .replace(CONNECTOR, '')
                  .split(SPLIT_SYMBOL)
                  .reverse()
                  .join('In')} from './${abiJsonFileName}';\n`,
            )
            .join(''),
        );
        res.map((name) => console.log(SuccessMessage(`${name} has been created`)));
        console.log(SuccessMessage('All abi json files have been created!'));
      } else {
        console.log(ErrorMessage('No abi json files have been created!'));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = fetcher;
