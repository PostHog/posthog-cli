import * as fs from 'fs'
import * as fetch from 'node-fetch'
import * as chalk from 'chalk'
import { PosthogConfig } from '../../types'

exports.command = ['search [term]', 's [term]']
exports.desc = 'Search the plugin repository'
exports.builder = {}
exports.handler = async function (argv) {
    const configPath = argv.config
    const search = (argv.term || '') as string
    const repoUrl = 'https://raw.githubusercontent.com/PostHog/plugins/main/plugins.json'

    let newFile = true
    let config = {} as PosthogConfig

    if (fs.existsSync(configPath)) {
        try {
            const jsonBuffer = fs.readFileSync(configPath)
            config = JSON.parse(jsonBuffer.toString())
            newFile = false
        } catch (e) {
            console.error(`Could not load posthog config at "${configPath}"`)
            process.exit(1)
        }
    }

    let plugins = []

    try {
        const response = await fetch(repoUrl)
        plugins = await response.json()
    } catch {
        console.error(`Error fetching repositories from: "${configPath}"`)
        process.exit(1)
    }

    const lowerSearch = search.toLowerCase()
    const matchingPlugins = plugins.filter(
        (p) => p.name.toLowerCase().includes(lowerSearch) || p.description.toLowerCase().includes(lowerSearch),
    )

    if (matchingPlugins.length === 0) {
        if (search) {
            console.log(`No plugins found matching "${search}"!`)
        } else {
            console.log('No plugins found!')
        }
    } else {
        console.log(`Found ${matchingPlugins.length} matching plugin${matchingPlugins.length === 1 ? '' : 's'}:`)
        console.log('')
        const digits = (matchingPlugins.length + 1).toString().length
        for (let i = 0; i < matchingPlugins.length; i++) {
            const plugin = matchingPlugins[i]
            console.log(`${(i + 1).toString().padStart(digits)}. ${highlight(plugin.name, search)}`)
            console.log(`${''.padStart(digits)}- ${highlight(plugin.description, search)}`)
            console.log(`${''.padStart(digits)}- ${highlight(plugin.url, search)}`)
            console.log('')
        }
    }
}

function highlight(text, string) {
    const simpletext = new RegExp("(" + string + ")","gi");
    return text.replace(simpletext, txt => chalk.bold(txt))
}