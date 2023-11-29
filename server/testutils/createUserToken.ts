import jwt, { JwtPayload } from 'jsonwebtoken'

export interface TokenPayload extends JwtPayload {
  auth_source?: string
  authorities?: string[]
  client_id?: string
  grant_type?: string
  scope?: string[]
  user_name?: string
}

export default function createUserToken(payload: Partial<TokenPayload> = {}): string {
  const defaultPayload: TokenPayload = {
    auth_source: 'nomis',
    authorities: [],
    client_id: 'clientid',
    grant_type: 'authorization_code',
    jti: '00000000-0000-0000-0000-000000000000',
    scope: ['read', 'write'],
    user_name: 'user1',
  }

  return jwt.sign({ ...defaultPayload, ...payload }, 'secret', { expiresIn: '1h' })
}
