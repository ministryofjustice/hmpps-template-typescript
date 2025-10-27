import esbuild from 'esbuild'
import { colors, emojis } from './utils.ts'
import { getAppConfig } from './app.config.ts'
import { getAssetsConfig, getAdditionalAssetsConfig } from './assets.config.ts'
import { getBuildConfig } from './build.config.ts'

/**
 * Run ESBuild process, if `--watch` provided, run in watch mode.
 */
async function main(): Promise<void> {
  const buildConfig = getBuildConfig()
  const appConfig = getAppConfig(buildConfig)
  const assetsConfig = getAssetsConfig(buildConfig)
  const additionalAssetsConfig = getAdditionalAssetsConfig(buildConfig)

  // Create ESBuild contexts with watch mode conditional on isWatchMode
  if (buildConfig.isWatchMode) {
    process.stderr.write(`${colors.bold}${emojis.eyes} Starting ESBuild watchers...${colors.reset}\n`)

    await Promise.all(
      [appConfig, assetsConfig, additionalAssetsConfig].map(async config => {
        const ctx = await esbuild.context(config)
        await ctx.watch()
      }),
    )
    return
  }

  // Run ESBuild in standard build mode
  process.stderr.write(`${colors.bold}${emojis.cog} Starting ESBuild...${colors.reset}\n`)

  await Promise.all([
    esbuild.build(appConfig),
    esbuild.build(assetsConfig),
    esbuild.build(additionalAssetsConfig),
  ]).catch(e => {
    process.stderr.write(`${e}\n`)
    process.exit(1)
  })
}

main()
