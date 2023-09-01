import { Response } from 'superagent'
import { stubFor } from './wiremock'

const stubHeader = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components/header',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        html: '<header><h1>Common Components Header</h1></header>',
        javascript: ['/common-components/header.js'],
        css: ['/common-components/header.css'],
      },
    },
  })

const stubHeaderFail = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components/header',
    },
    response: {
      status: 500,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  })

const stubFooter = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components/footer',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        html: '<header><h1>Common Components Footer</h1></header>',
        javascript: ['/common-components/footer.js'],
        css: ['/common-components/footer.css'],
      },
    },
  })

const stubFooterFail = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components/footer',
    },
    response: {
      status: 500,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  })

export default {
  stubComponents: (): Promise<[Response, Response]> => Promise.all([stubHeader(), stubFooter()]),
  stubComponentsFail: (): Promise<[Response, Response]> => Promise.all([stubHeaderFail(), stubFooterFail()]),
}
