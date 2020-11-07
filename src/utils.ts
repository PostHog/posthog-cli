import * as fetch from 'node-fetch'
import { PluginRepositoryEntry } from './types'
import { exec } from "child_process"
import { PluginConfigSchema } from 'posthog-plugins'

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

export function getConfigSchemaObject(
    configSchema: Record<string, PluginConfigSchema> | PluginConfigSchema[]
): Record<string, PluginConfigSchema> {
    if (Array.isArray(configSchema)) {
        const newSchema: Record<string, PluginConfigSchema> = {}
        configSchema.forEach((conf) => {
            if (conf.key) {
                newSchema[conf.key] = conf
            }
        })
        return newSchema
    } else {
        return configSchema
    }
}
