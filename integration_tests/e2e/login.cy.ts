import IndexPage from '../pages/index'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import AuthManageDetailsPage from '../pages/authManageDetails'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User name visible in header', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('User can log out', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.signOut().click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can manage their details', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)

    indexPage.manageDetails().get('a').invoke('removeAttr', 'target')
    indexPage.manageDetails().click()
    Page.verifyOnPage(AuthManageDetailsPage)
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')
  })

  it('Token verification failure clears user session', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')

    cy.task('stubVerifyToken', true)
    cy.task('stubAuthUser', 'bobby brown')
    cy.signIn()

    indexPage.headerUserName().contains('B. Brown')
  })
})
