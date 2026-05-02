import type { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { Session } from 'express-session'
import type { HmppsUser } from '../../interfaces/hmppsUser'
import type AuditService from '../../services/auditService'
import type ExampleService from '../../services/exampleService'

export interface ExampleDeps {
  auditService: AuditService
  exampleService: ExampleService
}

export type ExampleData = {
  currentTime: string
}

export type ExampleAnswers = Record<never, never>

export type ExampleRequestState = {
  user: HmppsUser
}

export type ExampleEffectFunctionContext = EffectFunctionContext<
  ExampleData,
  ExampleAnswers,
  Session,
  ExampleRequestState
>
