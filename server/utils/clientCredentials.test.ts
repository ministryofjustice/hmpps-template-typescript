import generateOauthClientToken from './clientCredentials'

describe('generateOauthClientToken', () => {
  it('Token can be generated', () => {
    const base64Creds = Buffer.from('bob:secret').toString('base64')
    expect(generateOauthClientToken('bob', 'secret')).toBe(`Basic ${base64Creds}`)
  })

  it('Token can be generated with special characters', () => {
    const value = generateOauthClientToken('bob', "p@'s&sw/o$+ rd1")
    const decoded = Buffer.from(value.substring(6), 'base64').toString('utf-8')

    expect(decoded).toBe("bob:p@'s&sw/o$+ rd1")
  })
})
