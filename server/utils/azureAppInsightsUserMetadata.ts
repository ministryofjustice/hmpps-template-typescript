import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import type { RequestHandler } from 'express'
import { HmppsUser } from '../interfaces/hmppsUser'

/**
 * Middleware to add basic user metadata to telemetry spans. It replaces old applicationinsights telemetry
 * processor implementations.
 *
 * The following attributes are added to the active span where relevant:
 *
 * - userId:            This is the auth source specific user ID. This may be one of:
 *                      nomis    - the staffId linked to the user
 *                      delius   - a numeric Delius user ID
 *                      external - the UUID assigned to the user by HMPPS Auth, same as the userUuid below
 *
 * - userUuid:          This is the UUID created by HMPPS Auth upon first user login that is unique to the user
 *                      across all authSources.  Using this in telemetry is prefered over username.
 *
 * - activeCaseLoadId:  The ID of the active caseload (applicable for prison users only)
 */
export default function addUserMetadataToTelemetry(): RequestHandler {
  return (_req, res, next) => {
    const user = (res.locals?.user ?? {}) as HmppsUser

    telemetry.setSpanAttributes({
      ...(user.userId && { userId: user.userId }),
      ...(user.userUuid && { userUuid: user.userUuid }),
      ...(user.authSource === 'nomis' && user.activeCaseLoadId && { activeCaseLoadId: user.activeCaseLoadId }),
    })
    return next()
  }
}
