import type { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { Session } from 'express-session'
import type { AuditService } from '@ministryofjustice/hmpps-audit-client'
import type { ApplicationInfo } from '../../applicationInfo'
import type { HmppsUser } from '../../interfaces/hmppsUser'
import type ExampleService from '../../services/exampleService'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
  SEARCH_OFFENDERS = 'SEARCH_OFFENDERS',
}

export interface ExampleDeps {
  applicationInfo: ApplicationInfo
  auditService: AuditService
  exampleService: ExampleService
}

export type ExampleData = {
  currentTime: string
}

export type ExampleAnswers = {
  searchTerm: string
}

export type ExampleRequestState = {
  user?: HmppsUser
  requestId: string
}

export type ExampleEffectFunctionContext = EffectFunctionContext<
  ExampleData,
  ExampleAnswers,
  Session,
  ExampleRequestState
>
