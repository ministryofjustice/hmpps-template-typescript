import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { hmppsAuthClient, applicationInfo } = dataAccess()

  const userService = new UserService(hmppsAuthClient)

  return {
    applicationInfo,
    userService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
