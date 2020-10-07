exports.command = 'plugin <command>'
exports.desc = 'Manage plugins'
exports.builder = function (yargs) {
    return yargs
        .command(require('./plugin_cmds/list'))
        .command(require('./plugin_cmds/install'))
        .command(require('./plugin_cmds/uninstall'))
}
exports.handler = function (argv) {}
