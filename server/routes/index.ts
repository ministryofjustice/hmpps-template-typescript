import { Router } from 'express'

import type { Services } from '../services'

export default function routes({ auditService, exampleService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => {
    await auditService.logPageView('EXAMPLE_PAGE', {
      who: res.locals.user.username,
      correlationId: req.id,
      subjectType: 'NOT_APPLICABLE',
    })

    const currentTime = await exampleService.getCurrentTime()
    return res.render('pages/index', { currentTime })
  })

  return router
}
