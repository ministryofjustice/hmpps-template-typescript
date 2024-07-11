const path = require('node:path')

const { copy } = require('esbuild-plugin-copy')
const { sassPlugin } = require('esbuild-sass-plugin')
const { clean } = require('esbuild-plugin-clean')
const esbuild = require('esbuild')
const { glob } = require('glob')

/**
 * Copy additional assets into distribution
 * @type {BuildStep}
 */
const buildAdditionalAssets = buildConfig => {
  return esbuild.build({
    outdir: buildConfig.assets.outDir,
    plugins: [
      copy({
        resolveFrom: 'cwd',
        assets: buildConfig.assets.copy,
      }),
    ],
  })
}

/**
 * Build scss and javascript assets
 * @type {BuildStep}
 */
const buildAssets = buildConfig => {
  return esbuild.build({
    entryPoints: buildConfig.assets.entryPoints,
    outdir: buildConfig.assets.outDir,
    entryNames: '[ext]/app',
    minify: buildConfig.isProduction,
    sourcemap: !buildConfig.isProduction,
    platform: 'browser',
    target: 'es2018',
    external: ['/assets/*'],
    bundle: true,
    plugins: [
      clean({
        patterns: glob.sync(buildConfig.assets.clear),
      }),
      sassPlugin({
        quietDeps: true,
        loadPaths: [process.cwd(), path.join(process.cwd(), 'node_modules')],
      }),
    ],
  })
}

/**
 * @param {BuildConfig} buildConfig
 * @returns {Promise}
 */
module.exports = buildConfig => {
  console.log('\u{1b}[1m\u{2728}  Building assets....\u{1b}[0m')

  return Promise.all([buildAssets(buildConfig), buildAdditionalAssets(buildConfig)]).catch(e => {
    console.error(e)
    process.exit(1)
  })
}
