import sanitisedError, { UnsanitisedError, SanitisedError } from './sanitisedError'

describe('sanitised error', () => {
  it('it should omit the request headers from the error object ', () => {
    const error = {
      name: '',
      status: 404,
      response: {
        req: {
          method: 'GET',
          url: 'https://test-api/endpoint?active=true',
          headers: {
            property: 'not for logging',
          },
        },
        headers: {
          date: 'Tue, 19 May 2020 15:16:20 GMT',
        },
        status: 404,
        statusText: 'Not found',
        text: { details: 'details' },
        body: { content: 'hello' },
      },
      message: 'Not Found',
      stack: 'stack description',
    } as unknown as UnsanitisedError

    const e = new Error() as SanitisedError
    e.message = 'Not Found'
    e.text = 'details'
    e.status = 404
    e.headers = { date: 'Tue, 19 May 2020 15:16:20 GMT' }
    e.data = { content: 'hello' }
    e.stack = 'stack description'

    expect(sanitisedError(error)).toEqual(e)
  })

  it('it should return the error message', () => {
    const error = {
      message: 'error description',
    } as unknown as UnsanitisedError

    expect(sanitisedError(error)).toBeInstanceOf(Error)
    expect(sanitisedError(error)).toHaveProperty('message', 'error description')
  })

  it('it should return an empty Error instance for an unknown error structure', () => {
    const error = {
      property: 'unknown',
    } as unknown as UnsanitisedError

    expect(sanitisedError(error)).toBeInstanceOf(Error)
    expect(sanitisedError(error)).not.toHaveProperty('property')
  })
})
