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

      await auditService.logPageView(page, {
        who: user?.username ?? 'unknown',
        correlationId: context.getState('requestId'),
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

/** Audits the submitted search term before the journey redirects. */
export const LogSearch = effect({
  name: 'LogSearch',
  factory:
    ({ auditService, applicationInfo }: ExampleDeps) =>
    async (context: ExampleEffectFunctionContext) => {
      const user = context.getState('user')
      const searchTerm = context.getAnswer('searchTerm')

      await auditService.logAuditEvent({
        correlationId: context.getState('requestId'),
        who: user?.username ?? 'unknown',
        what: Page.SEARCH_OFFENDERS,
        subjectType: 'SEARCH_TERM',
        subjectId: searchTerm,
        details: { build: applicationInfo.gitRef, userRoles: user?.userRoles ?? [] },
      })
    },
})
