import fs from 'fs'
import path from 'path'
import config from './config'

const packageJson =
  process.env.NODE_ENV !== 'test' ? path.join(__dirname, '../../package.json') : path.join(__dirname, '../package.json')

const { name: applicationName } = JSON.parse(fs.readFileSync(packageJson).toString())

const { buildNumber, gitRef } = config

export default { applicationName, buildNumber, gitRef, gitShortHash: gitRef.substring(0, 7) }
