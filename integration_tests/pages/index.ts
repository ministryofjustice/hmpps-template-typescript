import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('This site is under construction...')
  }

  fallbackHeaderUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  commonComponentsHeader = (): PageElement => cy.get('h1').contains('Common Components Header')

  commonComponentsFooter = (): PageElement => cy.get('h1').contains('Common Components Footer')
}
