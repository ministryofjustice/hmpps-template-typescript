import createApp from './app'
import { services } from './services'

const app = createApp(services())

export default app
