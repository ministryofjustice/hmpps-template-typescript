// eslint-disable import/no-unresolved,global-require
import fs from 'fs'

const packageData = JSON.parse(fs.readFileSync('./package.json').toString())
const buildNumber = fs.existsSync('./build-info.json')
  ? JSON.parse(fs.readFileSync('./build-info.json').toString()).buildNumber
  : packageData.version

export default { buildNumber, packageData }
