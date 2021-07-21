#!/usr/bin/env node

const program = require('commander');
const { init, run } = require('../src/commandHandler');
const packageJSON = require('../package.json');

program.version(packageJSON.version, '-v, --version');

program.command('init').action(init);
program.command('run').action(run);

program.command('help').action(() => {
  console.log('\nExamples:\n');
  console.log('$ abi-fetcher --init \n');
});

program.parse(process.argv);
