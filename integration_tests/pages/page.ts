import 'cypress-axe'
import { Result } from 'axe-core'

export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(
    private readonly title: string,
    private readonly skipA11y = false,
  ) {
    if (title) {
      this.checkOnPage()
    }
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
    if (!(Cypress.env('SKIP_AXE') || this.skipA11y)) {
      cy.injectAxe()
      cy.configureAxe({
        rules: [
          // Temporary rule whilst this issue is resolved https://github.com/w3c/aria/issues/1404
          { id: 'aria-allowed-attr', reviewOnFail: true },
          // Ignore the "All page content should be contained by landmarks", which conflicts with GOV.UK guidance (https://design-system.service.gov.uk/components/back-link/#how-it-works)
          { id: 'region', reviewOnFail: true, selector: '.govuk-back-link' },
        ],
      })
      cy.checkA11y(undefined, undefined, this.logAccessibilityViolations)
    }
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  logAccessibilityViolations(violations: Result[]): void {
    cy.task('logAccessibilityViolationsSummary', `Accessibility violations detected: ${violations.length}`)

    const violationData = violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
      nodeTargets: nodes.map(node => node.target).join(' - '),
    }))

    cy.task('logAccessibilityViolationsTable', violationData)
  }
}
