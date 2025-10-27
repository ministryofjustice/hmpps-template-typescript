import type { BuildOptions } from 'esbuild'
import path from 'node:path'
import { copy } from 'esbuild-plugin-copy'
import { sassPlugin } from 'esbuild-sass-plugin'
import { clean } from 'esbuild-plugin-clean'
import manifestPlugin from 'esbuild-plugin-manifest'
import { globSync } from 'node:fs'
import type { BuildConfig } from './build.config'
import { buildNotificationPlugin } from './utils.ts'

/**
 * Copy additional assets into distribution
 */
export const getAdditionalAssetsConfig = (buildConfig: BuildConfig): BuildOptions => ({
  outdir: buildConfig.assets.outDir,
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: buildConfig.assets.copy,
    }),
    buildNotificationPlugin('Assets (Additional)', buildConfig.isWatchMode),
  ],
})

/**
 * Build scss and javascript assets
 */
export const getAssetsConfig = (buildConfig: BuildConfig): BuildOptions => ({
  entryPoints: buildConfig.assets.entryPoints,
  outdir: buildConfig.assets.outDir,
  entryNames: '[ext]/[name].[hash]',
  minify: buildConfig.isProduction,
  sourcemap: !buildConfig.isProduction,
  platform: 'browser',
  target: 'es2018',
  external: ['/assets/*'],
  bundle: true,
  plugins: [
    clean({
      patterns: globSync(buildConfig.assets.clear),
    }),
    manifestPlugin({
      generate: entries =>
        Object.fromEntries(Object.entries(entries).map(paths => paths.map(p => p.replace(/^dist\//, '/')))),
    }),
    sassPlugin({
      quietDeps: true,
      loadPaths: [process.cwd(), path.join(process.cwd(), 'node_modules')],
    }),
    buildNotificationPlugin('Assets', buildConfig.isWatchMode),
  ],
})
