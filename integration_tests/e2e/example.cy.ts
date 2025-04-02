context('Example feature', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  it('Time from exampleApi is visible on page', () => {
    cy.task('stubExampleTime')
    cy.signIn()

    cy.get('#timestamp').contains('The time is currently 2025-01-01T12:00:00Z')
  })

  it('ExampleApi failure shows error page with custom error message', () => {
    cy.task('stubExampleTime', 500)

    cy.signIn({ failOnStatusCode: false })

    cy.get('h1').contains('There was an issue with the exampleApi')
  })
})
