import createApp from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import UserService from './services/userService'

const hmppsAuthClient = new HmppsAuthClient()
const userService = new UserService(hmppsAuthClient)

const app = createApp(userService)

export default app
