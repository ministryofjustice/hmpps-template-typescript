const { copy } = require('esbuild-plugin-copy')
const { typecheckPlugin } = require('@jgoz/esbuild-plugin-typecheck')
const esbuild = require('esbuild')
const glob = require('glob')

/**
 * Build typescript application into CommonJS
 * @type {BuildStep}
 */
const buildApp = buildConfig => {
  return esbuild
    .build({
      entryPoints: glob.sync(buildConfig.app.entryPoints),
      outdir: buildConfig.app.outDir,
      bundle: false,
      sourcemap: true,
      platform: 'node',
      format: 'cjs',
      plugins: [
        typecheckPlugin(),
        copy({
          resolveFrom: 'cwd',
          assets: buildConfig.app.copy,
        }),
      ],
    })
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}

/**
 * @param {BuildConfig} buildConfig
 * @returns {Promise}
 */
module.exports = buildConfig => {
  console.log('\u{1b}[1m\u{2728}  Building app....\u{1b}[0m')

  return buildApp(buildConfig)
}
