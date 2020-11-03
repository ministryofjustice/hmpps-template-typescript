const page = require('./page')

const indexPage = () =>
  page('This site is under construction...', {
    headerUserName: () => cy.get('[data-qa=header-user-name]'),
  })

module.exports = { verifyOnPage: indexPage }
