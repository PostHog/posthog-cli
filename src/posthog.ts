#!/usr/bin/env node
require('yargs')
    .command(require('./cmds/plugin.ts'))
    .demandCommand()
    .option('config', { alias: 'c', describe: 'Path to posthog.json', type: 'string', default: './posthog.json' })
    .help().argv
