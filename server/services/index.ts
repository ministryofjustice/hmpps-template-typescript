import { dataAccess } from '../data'
import AuditService from './auditService'
import ComponentService from './componentService'
import ExampleService from './exampleService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, exampleApiClient, probationClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    exampleService: new ExampleService(exampleApiClient),
    componentService: new ComponentService(probationClient)
  }
}

export type Services = ReturnType<typeof services>
