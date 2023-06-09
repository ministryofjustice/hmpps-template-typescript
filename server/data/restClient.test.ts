import nock from 'nock'
import RestClient from './restClient'
import { AgentConfig } from '../config'

const restClient = new RestClient(
  'name-1',
  {
    url: 'http://localhost:8080/api',
    timeout: {
      response: 1000,
      deadline: 1000,
    },
    agent: new AgentConfig(1000),
  },
  'token-1',
)

describe('POST', () => {
  it('Should return response body', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      .post('/api/test')
      .reply(200, { success: true })

    const result = await restClient.post({
      path: '/test',
    })

    expect(nock.isDone()).toBe(true)

    expect(result).toStrictEqual({
      success: true,
    })
  })

  it('Should return raw response body', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      .post('/api/test')
      .reply(200, { success: true })

    const result = await restClient.post({
      path: '/test',
      headers: { header1: 'headerValue1' },
      raw: true,
    })

    expect(nock.isDone()).toBe(true)

    expect(result).toMatchObject({
      req: { method: 'POST' },
      status: 200,
      text: '{"success":true}',
    })
  })

  it('Should not retry by default', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      .post('/api/test')
      .reply(500)

    await expect(
      restClient.post({
        path: '/test',
        headers: { header1: 'headerValue1' },
      }),
    ).rejects.toThrow('Internal Server Error')

    expect(nock.isDone()).toBe(true)
  })

  it('retries if configured to do so', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      .post('/api/test')
      .reply(500)
      .post('/api/test')
      .reply(500)
      .post('/api/test')
      .reply(500)

    await expect(
      restClient.post({
        path: '/test',
        headers: { header1: 'headerValue1' },
        retry: true,
      }),
    ).rejects.toThrow('Internal Server Error')

    expect(nock.isDone()).toBe(true)
  })

  it('can recover through retries', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      .post('/api/test')
      .reply(500)
      .post('/api/test')
      .reply(500)
      .post('/api/test')
      .reply(200, { success: true })

    const result = await restClient.post({
      path: '/test',
      headers: { header1: 'headerValue1' },
      retry: true,
    })

    expect(result).toStrictEqual({ success: true })
    expect(nock.isDone()).toBe(true)
  })
})
