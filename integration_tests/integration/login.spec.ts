import IndexPage from '../pages/index'
import AuthLoginPage from '../pages/authLogin'
import Page from '../pages/page'

context('Login', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthLoginPage)
  })

  it('User name visible in header', () => {
    cy.login()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('User can log out', () => {
    cy.login()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.logout().click()
    Page.verifyOnPage(AuthLoginPage)
  })
})
