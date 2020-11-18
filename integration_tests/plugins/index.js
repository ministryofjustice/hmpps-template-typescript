const { resetStubs } = require('../mockApis/wiremock')

const auth = require('../mockApis/auth')
const tokenVerification = require('../mockApis/tokenVerification')

module.exports = on => {
  on('task', {
    reset: resetStubs,

    getLoginUrl: auth.getLoginUrl,
    stubLogin: auth.stubLogin,

    stubAuthUser: auth.stubUser,
    stubAuthPing: auth.stubPing,

    stubTokenVerificationPing: tokenVerification.stubPing,
  })
}
