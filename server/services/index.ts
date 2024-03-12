import { dataAccess } from '../data'
import AuditService from './auditService'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, manageUsersApiClient, hmppsAuditClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)
  const auditService = new AuditService(hmppsAuditClient)

  return {
    applicationInfo,
    userService,
    auditService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
