# @wormhole/txn-wrapper

## Usage

Install

```
$ pnpm i @wormhole/txn-wrapper -S
```

In files

```javascript
import TxnWrapper, { TXN_PARAMS_TYPE } from '@wormhole-stc/txn-wrapper';

const txn = async () => {
  try {
    // return getSigner().sendUncheckedTransaction()
    return await TxnWrapper({
      // function name
      functionId: '0x1::ModuleName:FunctionName',
      // function return type
      // support string or array
      returnType: '0x1::STC:STC',
      // function params
      // obey function params order
      // support all basic param type
      params: [
        // support raw value
        'address',
        // u64
        {
          value: airdrop_id,
          type: TXN_PARAMS_TYPE.U64,
        },
        // vector<u8>
        {
          value: merkle_root,
          type: TXN_PARAMS_TYPE['vector<u8>'],
        },
        {
          value: proof,
          type: TXN_PARAMS_TYPE['vector<vector<u8>>'],
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};
```
