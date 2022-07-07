import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)

  return {
    userService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
