import * as fetch from 'node-fetch'
import { PluginRepositoryEntry } from './types'
import { exec } from "child_process"

export async function fetchRepositoryPlugins(): Promise<PluginRepositoryEntry[]> {
    const repoUrl = 'https://raw.githubusercontent.com/PostHog/plugins/main/repository.json'
    let plugins: PluginRepositoryEntry[] = []

    try {
        const response = await fetch(repoUrl)
        plugins = await response.json()
    } catch {
        console.error(`Error fetching repositories from: "${repoUrl}"`)
        process.exit(1)
    }

    return plugins
}

export function execShellCommand(cmd: string) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            } else {
                resolve(stdout ? stdout : stderr)
            }
        })
    })
}
