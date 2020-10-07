#!/usr/bin/env node
require('yargs')
  .command(require('./cmds/plugin.ts'))
  .demandCommand()
  .help()
  .argv
