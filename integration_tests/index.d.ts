declare namespace Cypress {
  interface Chainable {
    /**   * Custom command to login. Set failOnStatusCode to false if you expect and non 200 return code
     * @example cy.login({ failOnStatusCode: boolean })
     */
    login<S = unknown>(options?: { failOnStatusCode: false }): Chainable<S>
  }
}
