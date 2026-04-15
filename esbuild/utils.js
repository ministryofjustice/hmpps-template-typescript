/* eslint-disable max-classes-per-file */
const { deleteSync } = require('del')
const childProcess = require('node:child_process')
const { styleText } = require('node:util')

// Emoji constants
const emojis = {
  hammer: '\u{1F528}',
  checkmark: '\u{2705}',
  crossmark: '\u{274C} ',
  search: '\u{1F50D}',
  eyes: '\u{1F440}',
  cyclone: '\u{1F300}',
  rocket: '\u{1F680}',
  cog: '\u{2699}\u{FE0F}',
}

/** Build a colored "[Label]" prefix (auto-disables colors on non-TTY unless forced) */
function makePrefix(label, color) {
  return styleText(['bold', color], `[${label}]`)
}

/**
 * Create a line-buffering writer that prefixes complete lines and forwards them
 * Preserves ANSI color codes across line boundaries
 */
function createPrefixedLineWriter(label, color, writeFn) {
  let buffer = ''
  let activeAnsiState = '' // Track active ANSI codes
  const prefix = makePrefix(label, color)

  // Extract ANSI codes from a string
  // eslint-disable-next-line no-control-regex
  const ansiRegex = /\u001b\[[0-9;]*m/g

  function write(data) {
    buffer += typeof data === 'string' ? data : data.toString()

    // Split on \r\n | \n | \r, keep the last incomplete fragment in buffer
    const parts = buffer.split(/\r\n|\n|\r/)
    buffer = parts.pop() || ''
    if (parts.length === 0) return true

    const body = parts
      .map(line => {
        // Apply carried-over ANSI state to this line
        const lineWithState = activeAnsiState + line

        // Update active state based on ANSI codes in this line
        const matches = line.match(ansiRegex)
        if (matches) {
          matches.forEach(code => {
            if (code === '\u001b[0m') {
              activeAnsiState = '' // Reset code clears state
            } else {
              activeAnsiState = code // Store the color/style code
            }
          })
        }

        return `${prefix} ${lineWithState}\n`
      })
      .join('')

    // Return underlying backpressure signal
    return writeFn(body, 'utf8')
  }

  function flush() {
    if (buffer.length) {
      writeFn(`${prefix} ${activeAnsiState}${buffer}\n`, 'utf8')
      buffer = ''
      activeAnsiState = ''
    }
  }

  return { write, flush }
}

/**
 * Spawn a child process with automatic prefixed output
 */
function spawnPrefixed(command, args, { label, color, ipc = false }) {
  const child = childProcess.spawn(command, args, {
    stdio: ['inherit', 'pipe', 'pipe', ...(ipc ? ['ipc'] : [])],
  })

  const destStdout = process.stdout.write.bind(process.stdout)
  const destStderr = process.stderr.write.bind(process.stderr)

  if (child.stdout) {
    const outWriter = createPrefixedLineWriter(label, color, destStdout)

    child.stdout.on('data', outWriter.write)
    child.stdout.on('end', outWriter.flush)
    child.on('close', outWriter.flush)
  }

  if (child.stderr) {
    const errWriter = createPrefixedLineWriter(label, color, destStderr)

    child.stderr.on('data', errWriter.write)
    child.stderr.on('end', errWriter.flush)
    child.on('close', errWriter.flush)
  }

  return child
}

/**
 * ESBuild watcher process management
 */
class ESBuildManager {
  constructor(options = {}) {
    this.watchProcess = null
    this.options = {
      label: 'ESBuild',
      color: 'magenta',
      onBuildComplete: options.onBuildComplete || null,
    }
  }

  /**
   * Start the ESBuild watcher in development mode
   */
  start(isWatchMode) {
    const args = ['esbuild/runner.js']

    if (isWatchMode) {
      args.push('--watch')
    }

    this.watchProcess = spawnPrefixed('node', args, {
      label: this.options.label,
      color: this.options.color,
      ipc: true,
    })

    // Listen for IPC messages
    this.watchProcess.on('message', msg => {
      if (msg.type === 'app-build-complete' && this.options.onBuildComplete) {
        this.options.onBuildComplete()
      }
    })

    // Handle crashes/exits with non-zero error code
    this.watchProcess.on('exit', (code, signal) => {
      if (code !== null && code !== 0 && signal !== 'SIGTERM' && signal !== 'SIGINT') {
        process.exit(code)
      }
    })
  }
}

/**
 * Server process management with proper race condition handling
 */
class ServerManager {
  constructor(options = {}) {
    this.serverProcess = null
    this.options = {
      label: 'Node',
      color: 'green',
      ...options,
    }
  }

  /**
   * Start or restart the server
   * Properly handles race conditions by waiting for old process to exit
   */
  async restart() {
    if (this.serverProcess) {
      // Check if process is still alive before waiting for exit
      const isAlive = this.serverProcess.exitCode === null && this.serverProcess.signalCode === null

      if (isAlive) {
        await new Promise(resolve => {
          this.serverProcess.once('exit', resolve)
          this.serverProcess.kill()
        })
      }

      this.serverProcess = null
    }

    const nodeArgs = [
      ...(this.options.envFile ? [`--env-file=${this.options.envFile}`] : []),
      '--enable-source-maps',
      'dist/server.js',
    ]

    this.serverProcess = spawnPrefixed('node', nodeArgs, {
      label: this.options.label,
      color: this.options.color,
    })
  }
}

/**
 * Create plugin that notifies parent process on successful build
 */
function buildNotificationPlugin(buildName, isWatchMode) {
  return {
    name: 'build-notification',
    setup(build) {
      build.onStart(() => {
        process.stderr.write(`${styleText('bold', `${emojis.cyclone} Building ${buildName}...`)}\n`)
      })

      build.onEnd(result => {
        if (result.errors.length === 0) {
          process.stderr.write(`${styleText('bold', `${emojis.rocket} ${buildName} build complete!`)}\n`)

          if (isWatchMode) {
            process.send({ type: 'app-build-complete' })
          }
        } else {
          process.stderr.write(`${styleText('bold', `${emojis.crossmark} ${buildName} build failed`)}\n`)
        }
      })
    },
  }
}

function cleanPlugin(patterns = []) {
  return {
    name: 'clean',
    setup({ onStart: registerOnStartCallback }) {
      if (!patterns.length || patterns.length === 0) {
        return
      }

      registerOnStartCallback(() => {
        deleteSync(patterns)
      })
    },
  }
}

function getEnvFile(args) {
  const index = args.findIndex(arg => arg === '--env' || arg.startsWith('--env='))
  if (index === -1) return '.env'

  const value = args[index].slice(6) || args[index + 1]
  return value && !value.startsWith('--') ? value : '.env'
}

module.exports = {
  emojis,
  getEnvFile,
  buildNotificationPlugin,
  cleanPlugin,
  ESBuildManager,
  ServerManager,
}
