import { SPLIT_SYMBOL } from '../src/tools';

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

      // Get ABI from configUrl
      Object.keys(ret).forEach((abiName) => {
        // If has script_functions
        if (
          Array.isArray(ret[abiName].script_functions) &&
          ret[abiName].script_functions.length > 0
        ) {
          abiService[abiName] = {};
          // wrap script_functions
          ret[abiName].script_functions.forEach((func) => {
            const name = func.name;
            const { address, name: moduleName } = func.module_name;

            abiService[abiName][name] = (param) => {
              // 实际调用
              return opt.JsonRpc.send([address, moduleName, name].join(SPLIT_SYMBOL), param);
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
