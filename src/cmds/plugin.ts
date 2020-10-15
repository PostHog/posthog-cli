exports.command = ['plugin <command>', 'p <command>']
exports.desc = 'Manage plugins'
exports.builder = function (yargs) {
    return yargs
        .command(require('./plugin_cmds/add'))
        .command(require('./plugin_cmds/remove'))
        .command(require('./plugin_cmds/list'))
        .command(require('./plugin_cmds/search'))
        .command(require('./plugin_cmds/new'))
        .help().argv
}
exports.handler = function (argv) {
    console.log(`ERROR: Unknown command "plugin ${argv.command}"!`)
}
