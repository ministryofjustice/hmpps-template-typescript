const path = require('path')
const buildApp = require('./app.config')
const buildAssets = require('./assets.config')
const { glob } = require('glob')
const chokidar = require('chokidar')
const { spawn } = require('child_process')

const cwd = process.cwd()
const buildConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  app: {
    outDir: path.join(cwd, 'dist'),
    entryPoints: glob.sync([path.join(cwd, '*.ts'), path.join(cwd, 'server/**/*.ts')]),
    copy: [
      {
        from: path.join(cwd, 'server/views/**/*'),
        to: path.join(cwd, 'dist/server/views'),
      },
    ],
  },

  assets: {
    outDir: path.join(cwd, 'dist/server/assets'),
    entryPoints: glob.sync([
      path.join(cwd, 'server/assets/js/index.js'),
      path.join(cwd, 'server/assets/scss/application.scss'),
    ]),
    copy: [
      {
        from: path.join(cwd, 'server/assets/images/**/*'),
        to: path.join(cwd, 'dist/server/assets/images'),
      },
    ],
    clear: glob.sync([path.join(cwd, 'dist/server/assets/{css,js}')]),
  },
}

function main() {
  const chokidarOptions = {
    persistent: true,
    ignoreInitial: true,
  }

  const args = process.argv
  if (args.includes('--build')) {
    buildApp(buildConfig)
    buildAssets(buildConfig)
  }

  if (args.includes('--dev-server')) {
    let serverProcess = null
    chokidar.watch(['dist']).on('all', () => {
      if (serverProcess) serverProcess.kill()
      serverProcess = spawn('node', ['dist/server.js'], { stdio: 'inherit' })
    })
  }

  if (args.includes('--watch')) {
    console.log('\u{1b}[1m\u{1F52D} Watching for changes...\u{1b}[0m')
    // Assets
    chokidar.watch(['server/assets/**/*'], chokidarOptions).on('all', () => buildAssets(buildConfig))

    // App
    chokidar
      .watch(['server/**/*'], { ...chokidarOptions, ignored: 'server/assets/**/*' })
      .on('all', () => buildApp(buildConfig))
  }
}
main()