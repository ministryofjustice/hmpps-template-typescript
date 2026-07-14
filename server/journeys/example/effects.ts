import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Page } from '../../services/auditService'
import type { ExampleDeps, ExampleEffectFunctionContext } from './types'

export const exampleEffectRegistry = new EffectRegistry<ExampleDeps>()

export const ExampleEffects = {
  /**
   * Log a page view into HMPPS Audit
   * @param page - The page to report as accessed
   */
  LogPageView: exampleEffectRegistry.register(
    'LogPageView',
    deps => async (context: ExampleEffectFunctionContext, pageUrl: Page) => {
      const user = context.getState('user')
      const requestId = context.getRequestHeader('x-request-id')

      await deps.auditService.logPageView(pageUrl, {
        who: user?.username ?? 'unknown',
        correlationId: typeof requestId === 'string' ? requestId : undefined,
      })
    },
  ),

  /**
   * Load the current time form the HMPPS Kotlin template project
   * TODO: Replace this effect with whatever is relevant to LAA/your project
   */
  LoadCurrentTime: exampleEffectRegistry.register(
    'LoadCurrentTime',
    deps => async (context: ExampleEffectFunctionContext) => {
      const currentTime = await deps.exampleService.getCurrentTime()

      context.setData('currentTime', currentTime)
    },
  ),
}
