import UserService from './userService'
import MockedHmppsAuthClient from '../data/testutils/hmppsAuthClientSetup'

const token = 'some token'

describe('User service', () => {
  let hmppsAuthClient
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      hmppsAuthClient = new MockedHmppsAuthClient()
      userService = new UserService(hmppsAuthClient)
    })
    it('Retrieves and formats user name', async () => {
      hmppsAuthClient.getUser.mockResolvedValue({ name: 'john smith' })

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
    })
    it('Propagates error', async () => {
      hmppsAuthClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
