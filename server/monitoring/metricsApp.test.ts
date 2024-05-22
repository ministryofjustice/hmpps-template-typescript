import { Request } from 'express'
import { normalizePath } from './metricsApp'

describe('metricsApp', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('normalizePath', () => {
    it('normalises asset paths', () => {
      const req = {
        url: 'http://localhost:3000/assets/stylesheets/application.css',
      } as unknown as Request

      expect(normalizePath(req, {})).toBe('/assets/#assetPath')
    })

    it('normalises parameterised paths', () => {
      const req = {
        route: { path: 'prisoner/:prisonerNumber/alerts' },
        url: 'http://localhost:3000/prisoner/A1234AA/alerts',
      } as unknown as Request

      expect(normalizePath(req, {})).toBe('/prisoner/#val/alerts')
    })

    it('normalises prisoner numbers where path not available', () => {
      const req = {
        url: 'http://localhost:3000/prisoner/A1234AA/alerts',
      } as unknown as Request

      expect(normalizePath(req, {})).toBe('/prisoner/#val/alerts')
    })

    it('handles urls that have no parameterization', () => {
      const req = {
        url: 'http://localhost:3000/ping',
      } as unknown as Request

      expect(normalizePath(req, {})).toBe('/ping')
    })
  })
})
