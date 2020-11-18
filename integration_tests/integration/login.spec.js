const IndexPage = require('../pages/index')
const AuthLoginPage = require('../pages/authLogin')

context('Login', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    AuthLoginPage.verifyOnPage()
  })
  it('User name visible in header', () => {
    cy.login()
    const landingPage = IndexPage.verifyOnPage()
    landingPage.headerUserName().should('contain.text', 'J. Smith')
  })
  it('User can log out', () => {
    cy.login()
    const landingPage = IndexPage.verifyOnPage()
    landingPage.logout().click()
    AuthLoginPage.verifyOnPage()
  })
})
