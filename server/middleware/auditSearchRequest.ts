import type { RequestHandler } from 'express'
import { Services } from '../services'
import type { Page } from '../routes'

/**
 * Example middleware which audits search requests with the correct subject.
 * This can be adapted to handle different subject types, reading offender identifiers from the path or session where appropriate.
 */
export default function auditSearchRequest({ services, page }: { services: Services; page: Page }): RequestHandler {
  const { auditService, applicationInfo } = services

  return async (req, res, next) => {
    const { user } = res.locals

    const { searchTerm } = req.body
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
