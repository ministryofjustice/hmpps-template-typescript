import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, manageUsersApiClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  return {
    applicationInfo,
    userService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
