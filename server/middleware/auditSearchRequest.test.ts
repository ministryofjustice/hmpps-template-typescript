import type { Request, Response } from 'express'

import auditSearchRequest from './auditSearchRequest'
import { Services } from '../services'
import { Page } from '../routes'

describe('auditSearchRequest', () => {
  const logAuditEvent = jest.fn()
  const next = jest.fn()

  const services = {
    applicationInfo: { gitRef: 'abc1234' },
    auditService: { logAuditEvent },
  } as unknown as Services

  const req = { id: 'request123', query: { searchTerm: 'X123456' } } as unknown as Request

  const res = {
    locals: {
      user: { username: 'user1', userRoles: ['ROLE_EXAMPLE'] },
    },
  } as unknown as Response

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('logs an audit event with details from the request and user', async () => {
    await auditSearchRequest({ services, page: Page.SEARCH_OFFENDERS })(req, res, next)

    expect(logAuditEvent).toHaveBeenCalledWith({
      correlationId: 'request123',
      who: 'user1',
      action: Page.SEARCH_OFFENDERS,
      subjectType: 'SEARCH_TERM',
      subjectId: 'X123456',
      details: { build: 'abc1234', userRoles: ['ROLE_EXAMPLE'] },
    })
  })

  it('calls next after logging the audit event', async () => {
    await auditSearchRequest({ services, page: Page.SEARCH_OFFENDERS })(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('does not audit when search query body param is missing', async () => {
    const reqWithoutSearchTerm = { query: {} } as unknown as Request

    await auditSearchRequest({ services, page: Page.SEARCH_OFFENDERS })(reqWithoutSearchTerm, res, next)
    expect(logAuditEvent).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
