import * as fs from 'fs'
import * as path from 'path'
import * as fetch from 'node-fetch'
import { PluginRepositoryEntry, PosthogConfig, Plugin } from '../../types'
import { fetchRepositoryPlugins } from '../../utils'

exports.command = ['add <repository>', 'a <repository>']
exports.desc = 'Add a plugin to posthog.json'
exports.builder = {}
exports.handler = async function (argv) {
    const configPath = argv.config

    let name = ''
    let repository = argv.repository as string
    let tag: string | null = argv.tag || null

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
    }

    let defaultConfig = {}

    if (urlRepo) {
        const match = repository.match(/https?:\/\/(www\.|)github.com\/([^\/]+)\/([^\/]+)\/?$/)
        if (!match) {
            console.error('Repository must be in the format: https://github.com/user/repo')
            console.error(`Received: "${repository}". Exiting!`)
            process.exit(1)
        }
        const [, , user, repo] = match

        if (!tag) {
            const repoCommitsUrl = `https://api.github.com/repos/${user}/${repo}/commits`
            const repoCommits: Record<string, any>[] | null = await fetch(repoCommitsUrl)
                .then((response) => response?.json())
                .catch(() => null)

            if (!repoCommits || repoCommits.length === 0) {
                console.error(`Could not find repository: ${repository}`)
                process.exit(1)
            }

            tag = repoCommits[0].sha
        }

        const jsonUrl = `https://raw.githubusercontent.com/${user}/${repo}/${tag}/plugin.json`
        const json: PluginRepositoryEntry | null = await fetch(jsonUrl)
            .then((response) => response?.json())
            .catch(() => null)

        if (!json) {
            console.error(`Could not find plugin.json in repository: ${repository}`)
            if (argv.tag) {
                console.error(`Looked for a tag/commit: ${argv.tag}`)
            }
            process.exit(1)
        }

        if (json.config) {
            Object.entries(json.config).forEach(([key, { default: defaultValue }]) => {
                defaultConfig[key] = defaultValue
            })
        }
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

    let pluginConfig: Plugin = { name }
    if (urlRepo) {
        pluginConfig = { name, url: repository, tag }
    } else {
        pluginConfig = { name, path: repository }
    }
    config.plugins.push(pluginConfig)

    const configString = JSON.stringify(config, null, 2)

    try {
        fs.writeFileSync(configPath, configString)

        if (newFile) {
            console.log(`Creating new config at "${configPath}"`)
        }

        console.log('Plugin installed successfully.')
        if (tag) {
            console.log(`Tag: ${tag}`)
        }
        console.log('You must restart your server for the changes to take effect!')
        console.log('To enable the plugin globally for all teams, edit posthog.json and add the following "global" key:')
        console.log(JSON.stringify({ ...pluginConfig, global: { enabled: true, config: defaultConfig }  }, null, 2))
    } catch (e) {
        console.error(`Error writing to file "${configPath}"! Exiting!`)
        process.exit(1)
    }
}
