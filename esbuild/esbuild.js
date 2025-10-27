const { ESBuildManager, ServerManager, getEnvFile } = require('./utils')

function main() {
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
