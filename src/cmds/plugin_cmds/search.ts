import * as fs from 'fs'
import * as chalk from 'chalk'
import { PosthogConfig } from '../../types'
import { fetchRepositoryPlugins } from '../../utils'

exports.command = ['search [term]', 's [term]']
exports.desc = 'Search the plugin repository'
exports.builder = {}
exports.handler = async function (argv) {
    const configPath = argv.config
    const search = (argv.term || '') as string

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

    const plugins = await fetchRepositoryPlugins()

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