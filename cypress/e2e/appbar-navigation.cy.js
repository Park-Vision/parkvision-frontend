describe('load home page', () => {
  it('renders main page', () => {
    cy.visit('http://localhost:3000');
  });

  it('displays the header', () => {
    cy.visit('http://localhost:3000');
    cy.get('header').should('be.visible');
  });

  it('displays the footer', () => {
    cy.visit('http://localhost:3000');
  });

  it('navigates to the about page', () => {
    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-1t6c9ts > :nth-child(3) > .MuiTypography-root').click();
    /* ==== End Cypress Studio ==== */

    /* ==== Generated with Cypress Studio ==== */
    cy.get('h1').should('be.visible');
    cy.get('h1').should('have.text', ' ABOUT ');
    /* ==== End Cypress Studio ==== */
  });

  it('navigates to the contact page', () => {
    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-1t6c9ts > :nth-child(2) > .MuiTypography-root').should('be.visible');
    cy.get('.css-1t6c9ts > :nth-child(2) > .MuiTypography-root').click();
    cy.get('h1').should('be.visible');
    cy.get('h1').should('have.text', ' CONTACT ');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-1t6c9ts > :nth-child(2) > .MuiTypography-root').should('be.visible');
    cy.get('.css-1t6c9ts > :nth-child(2) > .MuiTypography-root').click();
    cy.get('h1').should('be.visible');
    cy.get('h1').should('have.text', ' CONTACT ');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('navigates to login page', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.get('.css-1t6c9ts > [data-cy="login"] > .MuiTypography-root').click();
    cy.get('.MuiCardMedia-root').should('be.visible');
    cy.get('#\\:r2\\:').should('be.visible');
    cy.get('#\\:r1\\:').should('be.visible');
    cy.get('[type="submit"]').should('be.visible');
    cy.get('form > .MuiButton-text').should('be.visible');
    cy.get('form > :nth-child(5)').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});