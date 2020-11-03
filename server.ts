/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from './server/utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import app from './server/index'
import log from './log'

app.listen(app.get('port'), () => {
  log.info(`Server listening on port ${app.get('port')}`)
})
