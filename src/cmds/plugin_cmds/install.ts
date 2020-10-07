exports.command = 'install <repository>'
exports.desc = 'Add plugin from git repository'
exports.builder = {}
exports.handler = function (argv) {
  console.log('adding repo %s', argv.repository)
}
