import config from '../config'

export default function generateOauthClientToken(
  clientId: string = config.apis.hmppsAuth.apiClientId,
  clientSecret: string = config.apis.hmppsAuth.apiClientSecret
): string {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${token}`
}
