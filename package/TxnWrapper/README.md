# @wormhole/txn-wrapper

## Usage

Install

```
$ pnpm i @wormhole/txn-wrapper -S
```

In files

```javascript
import TxnWrapper from '@wormhole-stc/txn-wrapper';

const txn = async () => {
  try {
    // return getSigner().sendUncheckedTransaction()
    return await TxnWrapper({
      // function name
      functionId: '0x1::ModuleName:FunctionName',
      // function type tag
      // support string or array
      typeTag: '0x1::STC:STC',
      // function params
      // obey function params order
      params: ['address', airdrop_id, merkle_root, [123456, 567890], proof],
    });
  } catch (err) {
    console.log(err);
  }
};
```
