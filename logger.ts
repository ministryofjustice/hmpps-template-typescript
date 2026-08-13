import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({
  name: 'HMPPS Typescript Template',
  stream: formatOut,
  level: (process.env.LOG_LEVEL as bunyan.LogLevel) || 'info',
})

export default logger
