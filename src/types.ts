export interface Plugin {
    name: string
    path?: string
    url?: string
    config?: Record<string, string>
}

export interface PosthogConfig {
    plugins?: Plugin[]
}

export interface PluginRepositoryEntryConfig {
    name: string
    type: string
    default: any
}

export interface PluginRepositoryEntry {
    name: string
    url: string
    description: string
    config?: Record<string, PluginRepositoryEntryConfig>
}
