import * as fs from 'fs'
import * as path from 'path'
import { PosthogConfig } from '../../types'

exports.command = ['install <repository>', 'i <repository>']
exports.desc = 'Add plugin from git repository'
exports.builder = {}
exports.handler = function (argv) {
    const configPath = argv.config
    const repository = argv.repository as string
    const urlRepo = repository.startsWith('http://') || repository.startsWith('https://')

    if (!urlRepo && !fs.existsSync(repository)) {
        console.error('Repository must start with "http://" or "https://" or be a local path.')
        console.error(`Received: "${repository}". Exiting!`)
        process.exit(1)
    }

    let newFile = true
    let config: PosthogConfig = {}

    if (fs.existsSync(configPath)) {
        try {
            const jsonBuffer = fs.readFileSync(configPath)
            config = JSON.parse(jsonBuffer.toString())
            newFile = false
        } catch (e) {
            console.error(`Could not load PostHog config at "${configPath}"`)
            process.exit(1)
        }
    }

    if (!config.plugins) {
        config.plugins = []
    }

    const pluginPathsUrls = config.plugins.map((plugin) => plugin.path || plugin.url).filter((p) => p)
    const pluginNames = config.plugins.map((plugin) => plugin.name).filter((p) => p)

    const name = repository
        .split(urlRepo ? '/' : path.sep)
        .filter((p) => p)
        .pop()

    if (pluginNames.includes(name)) {
        console.error(`Plugin "${name}" already installed! Exiting!`)
        process.exit(1)
    }

    if (pluginPathsUrls.includes(repository)) {
        console.error(`Plugin "${repository}" already installed! Exiting!`)
        process.exit(1)
    }

    if (urlRepo) {
        config.plugins.push({ name, url: repository })
    } else {
        config.plugins.push({ name, path: repository })
    }

    const configString = JSON.stringify(config, null, 2)

    try {
        fs.writeFileSync(configPath, configString)

        if (newFile) {
            console.log(`Creating new config at "${configPath}"`)
        }

        console.log('Plugin installed successfully')
    } catch (e) {
        console.error(`Error writing to file "${configPath}"! Exiting!`)
        process.exit(1)
    }
}
