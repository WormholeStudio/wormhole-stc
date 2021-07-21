# @wormhole-stc/abi-fetcher

## Usage

### Install

```shell
$ pnpm i @wormhole/abi-fetcher -S
```

### Configuration

You can create a `abi-fetcher.config.js` at project root path or use this commmand:

```shell
$ ./node_modules/.bin/abi-fetcher init
```

`abi-fetcher.config.js` will looks like this:

```javascript
module.exports = {
  // abis file output dir
  output: '',
  // provider url
  providerUrl: 'https://barnard-seed.starcoin.org',
  // modules address and name on chain
  // example: '0x1::moduleName'
  modules: ['0x1::moduleName'],
};
```

After `abi-fetcher.config.js` has been set, then use this command to fetch all abis config:

```shell
$ ./node_modules/.bin/abi-fetcher run
```

As default, all abis config file will be created at `./src/abis`

### Plugin In Vue2/3

The plugin wrapp all function of all abi config file and gather them as map type data under global key `AbiService`.
All wraped function whill list in console when `debug` be true.

Example.

Vue3(with starcoin)

```javascript
// main.js
import { createApp } from 'vue';
import { providers } from '@starcoin/starcoin';
import { AbiPlugin } from 'abi-fetcher';
import { providerUrl } from './abi-fetcher.config.js';

const { JsonRpcProvider } = providers;

import App from './App.vue';

const app = createApp(App);

app.use(AbiPlugin, {
  JsonRpc: new JsonRpcProvider(providerUrl || 'https://barnard-seed.starcoin.org'),
  configUrl: import('./abis/index'), // genereta by abi-fetcher run <Promise>
  debug: process.env.NODE_ENV === 'development',
});
```

```html
<!-- Component.vue -->
<template></template>
<script>
  import { getCurrentInstance, defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const { AbiService } = getCurrentInstance.appContext.config.globalProperties;
      // AbiService[moduleName][functionName](params)
    },
  });
</script>
```

Vue2(with starcoin)

```javascript
// main.js
import Vue from 'vue';
import { providers } from '@starcoin/starcoin';
import { AbiPlugin } from 'abi-fetcher';
import { providerUrl } from './abi-fetcher.config.js';

const { JsonRpcProvider } = providers;

import App from './App.vue';

Vue.use(AbiPlugin, {
  JsonRpc: new JsonRpcProvider(providerUrl || 'https://barnard-seed.starcoin.org'),
  configUrl: import('./abis/index'), // genereta by abi-fetcher run <Promise>
  debug: process.env.NODE_ENV === 'development',
});

new Vue(App);
```

```html
<!-- Component.vue -->
<template></template>
<script>
  export default {
    mounted() {
      const { AbiService } = this;
      // AbiService[moduleName][functionName](params)
    },
  };
</script>
```
