exports.command = 'plugin <command>'
exports.desc = 'Manage plugins'
exports.builder = function (yargs) {
    return yargs
        .command(require('./plugin_cmds/list.ts'))
        .command(require('./plugin_cmds/install.ts'))
        .command(require('./plugin_cmds/uninstall.ts'))
}
exports.handler = function (argv) {}
