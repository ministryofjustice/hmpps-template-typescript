Cypress.Commands.add('login', (options = { failOnStatusCode: true }) => {
  cy.request(`/`)
  cy.task('getLoginUrl').then((url: string) => cy.visit(url, options))
})
