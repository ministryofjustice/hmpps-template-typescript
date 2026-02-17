import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import ExampleService from './exampleService'
import logger from '../../logger'
import config from '../config'

export const services = () => {
  const { applicationInfo, exampleApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: AuditServiceFactory.createInstance(config.sqs.audit, logger),
    exampleService: new ExampleService(exampleApiClient),
  }
}

export type Services = ReturnType<typeof services>
