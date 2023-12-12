
const homeSelector = '[data-cy=Home]';
const contactSelector = '[data-cy=Contact-button]';
const aboutSelector = '[data-cy=About-button]';
const loginSelector = '[data-cy=login-button]';
const contactEmailSelector = '[data-cy=contact-email]';

describe('tests navigation in appbar', () => {
  it('renders main page', () => {
    cy.visit('http://localhost:3000');
  });

  it('displays the header', () => {
    cy.visit('http://localhost:3000');
    cy.get('header').should('be.visible');
  });

  it('navigates to the about page', () => {
    cy.visit('http://localhost:3000');

    cy.get(aboutSelector).click();

    /* ==== Generated with Cypress Studio ==== */
    cy.get('h1').should('be.visible');
    cy.get('h1').should('have.text', 'ABOUT');
    /* ==== End Cypress Studio ==== */
  });

  it('navigates to the contact page', () => {
    cy.visit('http://localhost:3000');
    cy.get(contactSelector).click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('h1').should('be.visible');
    cy.get('h1').should('have.text', 'CONTACT');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="contact-email"] > a').should('have.text', 'parkvision.info@gmail.com');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('navigates to login page', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.get(loginSelector).click();
    /* ==== End Cypress Studio ==== */
  });
});