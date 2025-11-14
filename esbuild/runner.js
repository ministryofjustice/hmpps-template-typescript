const esbuild = require('esbuild')
const { styleText } = require('node:util')
const { emojis } = require('./utils')
const { getAppConfig } = require('./app.config')
const { getAssetsConfig, getAdditionalAssetsConfig } = require('./assets.config')
const { getBuildConfig } = require('./build.config')

/**
 * Run ESBuild process, if `--watch` provided, run in watch mode.
 */
async function main() {
  const buildConfig = getBuildConfig()
  const appConfig = getAppConfig(buildConfig)
  const assetsConfig = getAssetsConfig(buildConfig)
  const additionalAssetsConfig = getAdditionalAssetsConfig(buildConfig)

  // Create ESBuild contexts with watch mode conditional on isWatchMode
  if (buildConfig.isWatchMode) {
    process.stderr.write(`${styleText('bold', `${emojis.eyes} Starting ESBuild watchers...`)}\n`)

    return Promise.all(
      [appConfig, assetsConfig, additionalAssetsConfig].map(async config => {
        const ctx = await esbuild.context(config)
        await ctx.watch()
      }),
    )
  }

  // Run ESBuild in standard build mode
  process.stderr.write(`${styleText('bold', `${emojis.cog} Starting ESBuild...`)}\n`)

  return Promise.all([
    esbuild.build(appConfig),
    esbuild.build(assetsConfig),
    esbuild.build(additionalAssetsConfig),
  ]).catch(e => {
    process.stderr.write(`${e}\n`)
    process.exit(1)
  })
}

main()
