import { Router } from 'express'

import type { Services } from '../services'
import auditSearchRequest from '../middleware/auditSearchRequest'
import { Page } from '../journeys/example/types'

export default function routes(services: Services): Router {
  const router = Router()

  // Example of an audited route.
  router.post('/perform-search', auditSearchRequest({ services, page: Page.SEARCH_OFFENDERS }), (_req, res) => {
    return res.redirect('/')
  })

  return router
}
