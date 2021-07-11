import { arrayify, hexlify } from '@ethersproject/bytes';
import { providers, utils, bcs } from '@starcoin/starcoin';
import KeyMirror from 'key-mirror';

let starcoinProvider;

if (window.starcoin) {
  starcoinProvider = new providers.Web3Provider(window.starcoin, 'any');
} else {
  console.error('[TxnWrapper] Has no window.starcoin! Maybe Install the starmask!');
}

// Data Type to Serialize Type
export const TXN_PARAMS_TYPE = KeyMirror({
  U8: null,
  U16: null,
  U32: null,
  U64: null,
  U128: null,
  Str: null,
  'vector<u8>': null,
  'vector<vector<u8>>': null,
});

/**
 * 带类型的数据变换
 */
export const SerizalWithType = (params) => {
  if (typeof params === 'string') return arrayify(params);

  if (typeof params === 'object') {
    const { value = '', type = '' } = params;
    const se = new bcs.BcsSerializer();

    // For Vector<Vector<u8>>
    if (type === TXN_PARAMS_TYPE['vector<vector<u8>>']) {
      if (Array.isArray(value)) {
        se.serializeLen(value.length);
        value.forEach((sub) => {
          const innerSE = new bcs.BcsSerializer();
          innerSE.serializeStr(sub);
          const hexedStr = hexlify(innerSE.getBytes());
          se.serializeLen(hexedStr.length / 2 - 1);
          se.serializeStr(sub);
        });
        return arrayify(hexlify(se.getBytes()));
      } else {
        throw new Error(`[TxnWrapper] ${type} need value as an array!`);
      }
    }

    if (type === TXN_PARAMS_TYPE['vector<u8>']) {
      se.serializeStr(value);
      const hex = hexlify(se.getBytes());
      return arrayify(hex);
    }

    // For normal data type
    else if (TXN_PARAMS_TYPE[type]) {
      se[`serialize${type}`](value);
      const hex = hexlify(se.getBytes());
      return arrayify(hex);
    }
    return value;
  }

  return null;
};

const TxnWrapper = async ({
  // Function Name on Contract
  functionId = '',
  // Function return type
  returnType = [],
  /**
   *  Function's Params
   *  [ {value: '', type: TXN_PARAMS_TYPE} ]
   */
  params = [],
  gasLimit = 20000000,
  gasPrice = 1,
}) => {
  try {
    const args = params.map((p) => SerizalWithType(p));

    const se = new bcs.BcsSerializer();
    utils.tx
      .encodeScriptFunction(
        functionId,
        utils.tx.encodeStructTypeTags(Array.isArray(returnType) ? returnType : [returnType]),
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

export default TxnWrapper;
