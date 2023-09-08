import type { RequestHandler } from 'express'

import logger from '../../logger'
import { Services } from '../services'
import config from '../config'

export default function getFrontendComponents({ feComponentsService }: Services): RequestHandler {
  return async (req, res, next) => {
    if (!config.apis.frontendComponents.enabled) {
      res.locals.feComponents = {}
      return next()
    }

    try {
      const { header, footer } = await feComponentsService.getComponents(['header', 'footer'], res.locals.user.token)

      res.locals.feComponents = {
        header: header.html,
        footer: footer.html,
        cssIncludes: [...header.css, ...footer.css],
        jsIncludes: [...header.javascript, ...footer.javascript],
      }
      return next()
    } catch (error) {
      logger.error(error, 'Failed to retrieve front end components')
      return next()
    }
  }
}
