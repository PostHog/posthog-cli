import * as fetch from 'node-fetch'

export async function fetchRepositoryPlugins() {
    const repoUrl = 'https://raw.githubusercontent.com/PostHog/plugins/main/plugins.json'
    let plugins = []

    try {
        const response = await fetch(repoUrl)
        plugins = await response.json()
    } catch {
        console.error(`Error fetching repositories from: "${repoUrl}"`)
        process.exit(1)
    }

    return plugins
}