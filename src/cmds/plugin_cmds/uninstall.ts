import * as fs from 'fs'
import { PosthogConfig } from '../../types'

exports.command = ['uninstall <repository>', 'u <repository>']
exports.desc = 'Uninstall plugin'
exports.builder = {}
exports.handler = function (argv) {
    const configPath = argv.config
    const repository = argv.repository as string

    let config = {} as PosthogConfig

    if (fs.existsSync(configPath)) {
        try {
            const jsonBuffer = fs.readFileSync(configPath)
            config = JSON.parse(jsonBuffer.toString())
        } catch (e) {
            console.error(`Could not load posthog config at "${configPath}"`)
            process.exit(1)
        }
    }

    if (!config.plugins) {
        config.plugins = []
    }

    if (!config.plugins.includes(repository)) {
        console.error(`Plugin "${repository}" not installed! Exiting!`)
        process.exit(1)
    }

    config.plugins = config.plugins.filter(r => r !== repository)

    const configString = JSON.stringify(config, null, 2)

    try {
        fs.writeFileSync(configPath, configString)
        console.log('Plugin uninstalled successfully')
    } catch (e) {
        console.error(`Error writing to file "${configPath}"! Exiting!`)
        process.exit(1)
    }
}
