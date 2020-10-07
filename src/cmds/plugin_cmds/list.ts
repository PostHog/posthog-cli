import * as fs from "fs"
import { PosthogConfig } from '../../types'

exports.command = 'list'
exports.desc = 'List installed plugins and their versions'
exports.builder = {}
exports.handler = function (argv) {
  const configPath = argv.config

  let newFile = true
  let config = {} as PosthogConfig

  if (fs.existsSync(configPath)) {
    try {
      const jsonBuffer = fs.readFileSync(configPath);
      config = JSON.parse(jsonBuffer.toString());
      newFile = false
    } catch (e) {
      console.error(`Could not load posthog config at "${configPath}"`)
      process.exit(1)
    }
  }

  const plugins = config.plugins || []

  if (plugins.length === 0) {
    console.log("No plugins installed!")
  } else {
    console.log(`${plugins.length} plugin${plugins.length === 1 ? '' : 's'} installed:`)
    for (const respository of plugins) {
      console.log(`- ${respository}`)
    }
  }
}