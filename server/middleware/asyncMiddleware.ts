import type { Request, Response, NextFunction, RequestHandler } from 'express'

export default function asyncMiddleware(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
