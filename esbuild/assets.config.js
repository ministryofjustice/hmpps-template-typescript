const { copy } = require('esbuild-plugin-copy')
const { sassPlugin } = require('esbuild-sass-plugin')
const { clean } = require('esbuild-plugin-clean')
const esbuild = require('esbuild')
const path = require('path')
const { glob } = require('glob')

const buildAdditionalAssets = buildConfig =>
  esbuild.build({
    outdir: buildConfig.assets.outDir,
    plugins: [
      copy({
        resolveFrom: 'cwd',
        assets: buildConfig.assets.copy,
      }),
    ],
  })

const buildAssets = buildConfig => {
  return esbuild.build({
    entryPoints: buildConfig.assets.entryPoints,
    outdir: buildConfig.assets.outDir,
    entryNames: '[ext]/app',
    minify: buildConfig.isProduction,
    sourcemap: !buildConfig.isProduction,
    platform: 'browser',
    target: 'es2015',
    external: ['/assets/*'],
    bundle: true,
    plugins: [
      clean({
        patterns: glob.sync(buildConfig.assets.clear),
      }),
      sassPlugin({
        importMapper: url => {
          const lastIndex = url.lastIndexOf('node_modules/')
          return lastIndex !== -1 ? path.join(process.cwd(), url.slice(lastIndex)) : url
        },
      }),
    ],
  })
}

module.exports = buildConfig => {
  console.log('\u{1b}[1m\u{2728}  Building assets....\u{1b}[0m')

  Promise.all([buildAssets(buildConfig), buildAdditionalAssets(buildConfig)]).catch(e => {
    console.log(e)
    process.exit(1)
  })
}