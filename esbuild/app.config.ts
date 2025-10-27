import type { BuildOptions } from 'esbuild'
import { copy } from 'esbuild-plugin-copy'
import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck'
import { globSync } from 'node:fs'
import type { BuildConfig } from './build.config'
import { buildNotificationPlugin } from './utils.ts'

/**
 * Build typescript application into CommonJS
 */
// eslint-disable-next-line import/prefer-default-export
export const getAppConfig = (buildConfig: BuildConfig): BuildOptions => {
  return {
    entryPoints: globSync(buildConfig.app.entryPoints),
    outdir: buildConfig.app.outDir,
    bundle: false,
    sourcemap: true,
    platform: 'node',
    format: 'cjs',
    plugins: [
      typecheckPlugin({ watch: buildConfig.isWatchMode }),
      copy({
        resolveFrom: 'cwd',
        assets: buildConfig.app.copy,
      }),
      buildNotificationPlugin('App', buildConfig.isWatchMode),
    ],
  }
}
