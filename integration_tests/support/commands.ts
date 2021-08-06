Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request(`/`)
  cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})
