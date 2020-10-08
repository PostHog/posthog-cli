import * as fs from 'fs'
import * as path from 'path'
import { PluginRepositoryEntry, PosthogConfig } from '../../types'
import { fetchRepositoryPlugins } from '../../utils'

exports.command = ['install <repository>', 'i <repository>']
exports.desc = 'Add plugin from git repository'
exports.builder = {}
exports.handler = async function (argv) {
    const configPath = argv.config

    let name = ''
    let repository = argv.repository as string
    let pluginConfig = {}

    let urlRepo = repository.startsWith('http://') || repository.startsWith('https://')

    if (!urlRepo && !fs.existsSync(repository)) {
        const plugins: PluginRepositoryEntry[] = await fetchRepositoryPlugins()
        const plugin = plugins.find((p) => p.name === repository)

        if (!plugin) {
            console.error(
                'Repository must start with "http://" or "https://", be a local path or a name in the repository.',
            )
            console.error(`Received: "${repository}". Exiting!`)
            process.exit(1)
        }

        name = repository
        repository = plugin.url
        urlRepo = true
        Object.entries(plugin.config).forEach(([key, obj]) => {
            pluginConfig[key] = typeof obj.default === 'undefined' ? '' : obj.default
        })
    }

    if (!name) {
        name = repository
            .split(urlRepo ? '/' : path.sep)
            .filter((p) => p)
            .pop()
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

    if (pluginNames.includes(name)) {
        console.error(`Plugin "${name}" already installed! Exiting!`)
        process.exit(1)
    }

    if (pluginPathsUrls.includes(repository)) {
        console.error(`Plugin "${repository}" already installed! Exiting!`)
        process.exit(1)
    }

    if (urlRepo) {
        config.plugins.push({ name, url: repository, config: pluginConfig })
    } else {
        config.plugins.push({ name, path: repository, config: pluginConfig })
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
