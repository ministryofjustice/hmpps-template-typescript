import type { RequestHandler } from 'express'
import { Page } from '../services/auditService'
import { Services } from '../services'

export default function auditSearchRequest({ services, page }: { services: Services; page: Page }): RequestHandler {
  const { auditService, applicationInfo } = services

  return async (req, res, next) => {
    const { user } = res.locals

    const { searchTerm } = req.query // search terms should be passed via post body rather than query params, but this is to allow testing
    if (typeof searchTerm === 'string') {
      await auditService.logAuditEvent({
        correlationId: req.id,
        who: user.username,
        what: page,
        subjectType: 'SEARCH_TERM',
        subjectId: searchTerm,
        details: { build: applicationInfo.gitRef, userRoles: user.userRoles },
      })
    }

    next()
  }
}
