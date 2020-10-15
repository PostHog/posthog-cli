#!/usr/bin/env node
require('yargs')
    .command(require('./cmds/plugin'))
    .demandCommand()
    .option('config', { alias: 'c', describe: 'Path to posthog.json', type: 'string', default: './posthog.json' })
    .option('tag', { alias: 't', describe: 'Git tag when adding plugins', type: 'string' })
    .help().argv
