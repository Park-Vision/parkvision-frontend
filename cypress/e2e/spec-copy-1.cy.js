describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('h1').click();
    cy.get('h1').should('be.visible');
    cy.get('h1').should('have.text', 'Kitchen Sink');
    cy.get(':nth-child(3) > .container > .row > #utilities > h2').should('have.text', 'Commands');
    cy.get(':nth-child(3) > .container > .row > #utilities > h2').should('be.visible');
    cy.get(':nth-child(7) > .container > .row > #utilities > h2').should('be.visible');
    cy.get(':nth-child(7) > .container > .row > #utilities > h2').should('have.text', 'Cypress API');
    /* ==== End Cypress Studio ==== */
  })
})