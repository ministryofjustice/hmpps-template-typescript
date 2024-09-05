import config from '../config'

export default function generateOauthClientToken(
  clientId: string = config.apis.hmppsAuth.authClientId,
  clientSecret: string = config.apis.hmppsAuth.authClientSecret,
): string {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${token}`
}
