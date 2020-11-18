Cypress.Commands.add('login', () => {
  cy.request(`/`)
  cy.task('getLoginUrl').then(cy.visit)
})
