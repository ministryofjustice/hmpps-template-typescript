import { type RequestHandler, Router } from 'express'

import createError from 'http-errors'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import logger from '../../logger'

export default function routes({ auditService, exampleService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const currentTime = await exampleService.getCurrentTime()

      return res.render('pages/index', { currentTime })
    } catch (e) {
      logger.error(e)

      return next(createError(500, 'There was an issue with the exampleApi'))
    }
  })

  return router
}
