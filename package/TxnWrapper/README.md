# @wormhole/txn-wrapper

## Usage

Install

```
$ pnpm i @wormhole/txn-wrapper -S
```

In files

```javascript
import TxnWrapperfrom '@wormhole-stc/txn-wrapper';

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
      params: [
        // support raw value
        'address',
        // u64
         airdrop_id,
        // vector<u8>
         merkle_root,
        // vector<u128>
        [123456, 567890],
        proof,
      ],
    });
  } catch (err) {
    console.log(err);
  }
};
```
