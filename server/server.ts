import './utils/azureAppInsights'

import app from './index'
import logger from './logger'

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})
