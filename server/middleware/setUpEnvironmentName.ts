/* eslint-disable no-param-reassign */
import express from 'express'
import config from '../config'

export default (app: express.Express) => {
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
}
