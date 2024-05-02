export type AuthSource = 'nomis' | 'delius' | 'external'

export interface BaseUser {
  authSource: AuthSource
  username: string
  userId: string
  name: string
  displayName: string
  userRoles: string[]
  token: string
}

export interface PrisonUser extends BaseUser {
  authSource: 'nomis'
  staffId: number
}

export interface ProbationUser extends BaseUser {
  authSource: 'delius'
}

export interface ExternalUser extends BaseUser {
  authSource: 'external'
}

export type HmppsUser = PrisonUser | ProbationUser | ExternalUser
