import { ESBuildManager, ServerManager, getEnvFile } from './utils.ts'

function main(): void {
  const args = process.argv
  const isWatchMode = args.includes('--watch')
  const envFile = getEnvFile(args)

  const serverManager = new ServerManager({
    envFile,
  })
  const esbuildManager = new ESBuildManager({
    onBuildComplete: () => serverManager.restart(),
  })

  esbuildManager.start(isWatchMode)
}

main()
