import { stubFor } from './wiremock'

const stubComponents = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components/components\\?component=header&component=footer',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        header: {
          html: '<header><h1>Common Components Header</h1></header>',
          javascript: ['/common-components/header.js'],
          css: ['/common-components/header.css'],
        },
        footer: {
          html: '<footer><h1>Common Components Footer</h1></footer>',
          javascript: ['/common-components/footer.js'],
          css: ['/common-components/footer.css'],
        },
      },
    },
  })

const stubComponentsFail = () =>
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

export default {
  stubComponents,
  stubComponentsFail,
}
