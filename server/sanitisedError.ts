import type { ResponseError } from 'superagent'

export interface SanitisedError extends Error {
  text?: string
  status?: number
  headers?: unknown
  data?: unknown
  stack: string
  message: string
}

export type UnsanitisedError = ResponseError

export default function sanitise(error: UnsanitisedError): SanitisedError {
  const e = new Error() as SanitisedError
  e.message = error.message
  e.stack = error.stack
  if (error.response) {
    e.text = error.response.text
    e.status = error.response.status
    e.headers = error.response.headers
    e.data = error.response.body
  }
  return e
}
