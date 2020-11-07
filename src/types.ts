import { PluginConfigSchema } from 'posthog-plugins'

export interface Plugin {
    name: string
    path?: string
    url?: string
    tag?: string
}

export interface PosthogConfig {
    plugins?: Plugin[]
}

export interface PluginRepositoryEntry {
    name: string
    url: string
    description: string
    config?: Record<string, PluginConfigSchema> | PluginConfigSchema[]
}
