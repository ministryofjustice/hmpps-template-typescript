declare namespace Cypress {
  interface Chainable {
    /**   * Custom command to signIn. Set failOnStatusCode to false if you expect and non 200 return code
     * @example cy.signIn({ failOnStatusCode: boolean })
     */
    signIn<S = unknown>(options?: { failOnStatusCode: false }): Chainable<S>
  }
}
