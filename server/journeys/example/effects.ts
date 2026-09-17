import { effect } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Page } from './types'
import type { ExampleDeps, ExampleEffectFunctionContext } from './types'

/** Logs a page view through the application's audit service. */
export const LogPageView = effect({
  name: 'LogPageView',
  factory:
    ({ auditService }: ExampleDeps) =>
    async (context: ExampleEffectFunctionContext, page: Page) => {
      const user = context.getState('user')
      const requestId = context.getRequestHeader('x-request-id')

      await auditService.logPageView(page, {
        who: user?.username ?? 'unknown',
        correlationId: typeof requestId === 'string' ? requestId : undefined,
      })
    },
})

/** Loads the example API's current time for the journey to display. */
export const LoadCurrentTime = effect({
  name: 'LoadCurrentTime',
  factory:
    ({ exampleService }: ExampleDeps) =>
    async (context: ExampleEffectFunctionContext) => {
      const currentTime = await exampleService.getCurrentTime()

      context.setData('currentTime', currentTime)
    },
})
