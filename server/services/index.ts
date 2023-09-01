import { dataAccess } from '../data'
import UserService from './userService'
import FeComponentsService from './feComponentsService'

export const services = () => {
  const { hmppsAuthClient, applicationInfo, feComponentsClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const feComponentsService = new FeComponentsService(feComponentsClient)

  return {
    applicationInfo,
    userService,
    feComponentsService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
