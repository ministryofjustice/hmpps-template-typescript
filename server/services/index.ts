import { dataAccess } from '../data'
import AuditService from './auditService'
import ExampleApi from './exampleApi'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const exampleApi = new ExampleApi(hmppsAuthClient)

  return {
    applicationInfo,
    auditService,
    exampleApi,
  }
}

export type Services = ReturnType<typeof services>
