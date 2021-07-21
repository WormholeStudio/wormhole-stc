const ErrorMessage = (message) => console.error(`[AbiFetchter Plugin] -- ${message}`);

export default {
  async install(app, opt) {
    if (!opt.JsonRpc) {
      ErrorMessage('opt.JsonRpc shouble not empty');
      return;
    }

    if (opt.configUrl instanceof Promise) {
      const ret = await opt.configUrl;
      const abiService = {};

      Object.keys(ret).forEach((abiName) => {
        if (
          Array.isArray(ret[abiName].script_functions) &&
          ret[abiName].script_functions.length > 0
        ) {
          abiService[abiName] = {};
          ret[abiName].script_functions.forEach((func) => {
            const name = func.name;
            // .split('_')
            // .map((word) => {
            //   return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
            // })
            // .join('');
            abiService[abiName][name] = () => {
              // 实际调用
              JsonRpc.send('contract.resolve_function', [
                '0xf8af03dd08de49d81e4efd9e24c039cc::MerkleDistributorScript::create',
              ])
                .then((res) => {
                  moduleJsonData.value = res;
                })
                .catch(({ error }) => {
                  console.dir(error.message);
                });
            };
          });
        }
      });

      const [mainVersion] = app.version.split('.');
      if (mainVersion == 2) {
        app.prototype.AbiService = abiService;
      } else if (mainVersion == 3) {
        app.config.globalProperties.AbiService = abiService;
      }

      if (opt.debug) {
        console.log(abiService);
      }
    }
  },
};
