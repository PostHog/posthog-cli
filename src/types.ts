export interface Plugin {
    name: string
    path?: string
    url?: string
    config?: Record<string, string>
}

export interface PosthogConfig {
    plugins?: (string | Plugin)[]
}
