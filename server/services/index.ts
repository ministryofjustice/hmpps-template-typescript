import { dataAccess } from '../data'
import AuditService from './auditService'
import ExampleService from './exampleService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, exampleApiClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const exampleService = new ExampleService(exampleApiClient)

  return {
    applicationInfo,
    auditService,
    exampleService,
  }
}

export type Services = ReturnType<typeof services>
