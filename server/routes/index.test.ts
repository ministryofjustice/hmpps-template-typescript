import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
      })
  })
})

describe('GET /info', () => {
  it('should render index page', () => {
    return request(app)
      .get('/info')
      .expect('Content-Type', /application\/json/)
      .expect(res => {
        expect(res.text).toContain('productId')
      })
  })
})
