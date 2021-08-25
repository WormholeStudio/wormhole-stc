import { arrayify, hexlify } from '@ethersproject/bytes';
import { providers, utils, bcs } from '@starcoin/starcoin';

let starcoinProvider;
let jsonProvider;

const PROVIDER_URL_MAP = {
  1: 'https://main-seed.starcoin.org',
  251: 'https://barnard-seed.starcoin.org',
  253: 'https://halley-seed.starcoin.org',
};

if (window.starcoin) {
  starcoinProvider = new providers.Web3Provider(window.starcoin, 'any');
  jsonProvider = (url) =>
    new providers.JsonRpcProvider(url || PROVIDER_URL_MAP[window.starcoin.networkVersion]);
} else {
  console.error('[TxnWrapper] Has no window.starcoin! Maybe Install the starmask!');
}

/**
 * 带类型的数据变换
 */
export const SerizalWithType = (params = { value: '', type: '' }) => {
  const { value = '', type = '' } = params;
  if (type === 'Address') return arrayify(value);

  const se = new bcs.BcsSerializer();

  if (type && type.Vector === 'U8') {
    se.serializeStr(value);
    const hex = hexlify(se.getBytes());
    return arrayify(hex);
  }

  if (type && type.Vector && Array.isArray(value)) {
    se.serializeLen(value.length);
    value.forEach((sub) => {
      const innerSE = new bcs.BcsSerializer();

      // 字符串的数组 vector<vector<u8>>
      if (type.Vector.Vector === 'U8') {
        innerSE[`serializeStr`](sub);
      } else if (type.Vector) {
        // 其他类型的数组 vector<u8>
        se[`serialize${type.Vector}`](sub);
      }

      const hexedStr = hexlify(innerSE.getBytes());
      // 字符串的数组 vector<vector<u8>>
      if (type.Vector.Vector === 'U8') {
        se.serializeLen(hexedStr.length / 2 - 1);
        se.serializeStr(sub);
      }
    });
    return arrayify(hexlify(se.getBytes()));
  }

  // For normal data type
  if (type) {
    se[`serialize${type}`](value);
    const hex = hexlify(se.getBytes());
    return arrayify(hex);
  }

  return value;
};

const TxnWrapper = async ({
  // Function Name on Contract
  functionId = '',
  // Function type tag
  typeTag = [],
  /**
   *  Function's Params
   *  [ param_1, param_2, ... ]
   */
  params = [],
  gasLimit = 20000000,
  gasPrice = 1,
}) => {
  if (!functionId) throw new Error('[TxnWrapper] TxnWrapper must has fucntionId');

  try {
    // Get function resolve
    const { args: functionResolve } = await jsonProvider().send('contract.resolve_function', [
      functionId,
    ]);

    // Remove the first Signer type
    if (functionResolve[0] && functionResolve[0].type_tag === 'Signer') {
      functionResolve.shift();
    }

    const args = params.map((value, index) =>
      SerizalWithType({
        value,
        type: functionResolve[index].type_tag,
      }),
    );

    const se = new bcs.BcsSerializer();
    utils.tx
      .encodeScriptFunction(
        functionId,
        typeTag ? utils.tx.encodeStructTypeTags(Array.isArray(typeTag) ? typeTag : [typeTag]) : [],
        args,
      )
      .serialize(se);
    const payloadInHex = hexlify(se.getBytes());

    const txn = await starcoinProvider.getSigner().sendUncheckedTransaction({
      data: payloadInHex,
      gasLimit,
      gasPrice,
    });

    return txn;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const JsonProvider = jsonProvider;

export default TxnWrapper;
