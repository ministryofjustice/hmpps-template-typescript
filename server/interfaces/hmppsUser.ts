export type AuthSource = 'nomis' | 'delius' | 'external' | 'azuread'

/**
 * These are the details that all user types share.
 */
export interface BaseUser {
  authSource: AuthSource
  username: string
  userId: string
  name: string
  displayName: string
  userRoles: string[]
  token: string
}

/**
 * Prison users are those that have a user account in NOMIS.
 * HMPPS Auth automatically grants these users a `ROLE_PRISON` role.
 * Prison users have an additional numerical staffId. The userId is
 * a stringified version of the staffId. Some teams may need to separately
 * retrieve the user case load (which prisons that a prison user has access
 * to) and store it here, an example can be found in `hmpps-prisoner-profile`.
 */
export interface PrisonUser extends BaseUser {
  authSource: 'nomis'
  staffId: number
}

/**
 * Probation users are those that have a user account in nDelius.
 * HMPPS Auth automatically grants these users a `ROLE_PROBATION` role.
 */
export interface ProbationUser extends BaseUser {
  authSource: 'delius'
}

/**
 * External users are those that have a user account in our External Users
 * database. These accounts are created for users that need access to HMPPS
 * services but have neither NOMIS nor nDelius access.
 */
export interface ExternalUser extends BaseUser {
  authSource: 'external'
}

/**
 * AzureAD users are those that have a justice.gov.uk email address and
 * an account in MoJ's Azure AD (now called Entra ID) tenant. HMPPS Auth
 * will normally check to see if there is a Prison/Probation/External
 * user with the same email address and request that the user to pick one
 * to use to access the service, however if there is no match, it is
 * possible that a user of this type could attempt to access the service,
 * and would have no user roles associated.
 */
export interface AzureADUser extends BaseUser {
  authSource: 'azuread'
}

export type HmppsUser = PrisonUser | ProbationUser | ExternalUser | AzureADUser
