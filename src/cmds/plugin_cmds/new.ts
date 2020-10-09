import * as fs from 'fs'
import { execShellCommand } from '../../utils'

exports.command = ['new <name>', 'n <name>']
exports.desc = 'Bootstrap a new plugin project/folder'
exports.builder = {}
exports.handler = async function (argv) {
    const name = (argv.name || '') as string

    if (!name.match(/^[A-Za-z0-9\-_]+$/)) {
        console.error(`The project's name can only contain alphanumeric characters, a dash ('-') and an underscore ('_')`)
        console.error(`Given: ${name}`)
        process.exit(1)
    }

    if (fs.existsSync(name)) {
        console.error(`A file or folder "${name}" already exists`)
        process.exit(1)
    }

    try {
        await execShellCommand('git version')
    } catch (e) {
        console.error(`Could not find "git" in the path`)
        process.exit(1)
    }

    const repository = "https://github.com/PostHog/helloworldplugin"
    console.log(`Cloning repository ${repository} into ${name}`)
    await execShellCommand(`git clone ${repository} ${name}`)
    console.log('Removing the origin remote')
    await execShellCommand(`cd ${name}`)
    await execShellCommand(`git remote remove origin`)
    await execShellCommand(`cd ..`)
    console.log('All done! Happy Hacking! :-)')
    console.log('')
}
