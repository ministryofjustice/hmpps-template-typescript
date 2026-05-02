import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Page } from '../../services/auditService'
import type { ExampleDeps, ExampleEffectFunctionContext } from './types'

export interface ExampleEffectShape {
  /**
   * Log a page view into HMPPS Audit
   * @param page - The page to report as accessed
   */
  LogPageView: (page: Page) => EffectFunctionExpr

  /**
   * Load the current time form the HMPPS Kotlin template project
   * TODO: Replace this effect with whatever is relevant to LAA/your project
   */
  LoadCurrentTime: () => EffectFunctionExpr
}

export const { effects: ExampleEffects, implementations: exampleEffectImplementations } = defineEffectFunctions<
  ExampleEffectShape,
  ExampleDeps
>({
  LogPageView: deps => async (context: ExampleEffectFunctionContext, pageUrl: Page) => {
    const user = context.getState('user')
    const requestId = context.getRequestHeader('x-request-id')

    await deps.auditService.logPageView(pageUrl, {
      who: user?.username ?? 'unknown',
      correlationId: typeof requestId === 'string' ? requestId : undefined,
    })
  },

  LoadCurrentTime: deps => async (context: ExampleEffectFunctionContext) => {
    const currentTime = await deps.exampleService.getCurrentTime()

    context.setData('currentTime', currentTime)
  },
})
