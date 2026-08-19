import assert from 'assert'
import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

export function validateLogLevel(level: string): asserts level is bunyan.LogLevelString {
  const validLogLevels: Array<bunyan.LogLevelString> = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
  assert(
    validLogLevels.includes(level as bunyan.LogLevelString),
    `Invalid log level: '${logLevel}', valid options: '${validLogLevels}'`,
  )
}

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logLevel = process.env.LOG_LEVEL?.toLowerCase().trim() || 'info'

validateLogLevel(logLevel)

const logger = bunyan.createLogger({
  name: 'HMPPS Typescript Template',
  stream: formatOut,
  level: logLevel,
})

export default logger
