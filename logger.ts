import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const validLogLevels = new Set(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
const envLogLevel = process.env.LOG_LEVEL?.toLowerCase().trim() || 'info'
const logLevel: bunyan.LogLevel = validLogLevels.has(envLogLevel) ? (envLogLevel as bunyan.LogLevel) : 'info'

const logger = bunyan.createLogger({
  name: 'HMPPS Typescript Template',
  stream: formatOut,
  level: logLevel,
})

export default logger
