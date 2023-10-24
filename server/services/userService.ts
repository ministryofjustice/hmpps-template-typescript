import { convertToTitleCase } from '../utils/utils'
import type { User } from '../data/manageUsersApiClient'
import ManageUsersApiClient from '../data/manageUsersApiClient'

export interface UserDetails extends User {
  displayName: string
}

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.manageUsersApiClient.getUser(token)
    return { ...user, displayName: convertToTitleCase(user.name) }
  }
}
