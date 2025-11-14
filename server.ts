// Require app insights before anything else to allow for instrumentation of bunyan and express
import 'applicationinsights'

import app from './server/index'
import logger from './logger'

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})
