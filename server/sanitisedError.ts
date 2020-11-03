import type { ResponseError } from 'superagent'

interface SanitisedError {
  text?
  status?
  headers?
  data?
  stack
  message
}

export type UnsanitisedError = ResponseError

export default function sanitise(error: UnsanitisedError): SanitisedError {
  if (error.response) {
    return {
      text: error.response.text,
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.body,
      message: error.message,
      stack: error.stack,
    }
  }
  return {
    message: error.message,
    stack: error.stack,
  }
}
