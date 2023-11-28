import jwt from 'jsonwebtoken'

interface TokenPayload {
  user_name: string
  scope: string[]
  auth_source: string
  authorities: string[]
  jti: string
  client_id: string
}

export default function createUserToken(payload: Partial<TokenPayload> = {}): string {
  const defaultPayload: TokenPayload = {
    user_name: 'user1',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities: [],
    jti: '00000000-0000-0000-0000-000000000000',
    client_id: 'clientid',
  }

  return jwt.sign({ ...defaultPayload, ...payload }, 'secret', { expiresIn: '1h' })
}
