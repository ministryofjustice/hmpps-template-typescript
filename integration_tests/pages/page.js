module.exports = (name, pageObject = {}) => {
  const checkOnPage = () => cy.get('h1').contains(name)
  const logout = () => cy.get('[data-qa=logout]')
  checkOnPage()
  return { ...pageObject, checkStillOnPage: checkOnPage, logout }
}
