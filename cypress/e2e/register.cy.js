describe('Register e2e', () => {
  beforeEach(() => {
    cy.viewport('iphone-8');
    cy.visit('http://localhost:3000/register');
  })

  it('renders', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiCardMedia-root').should('be.visible');
    cy.get('.MuiCardContent-root > .MuiTypography-h5').should('be.visible');
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="first-name-input"]').should('be.visible');
    cy.get('[data-cy="last-name-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').scrollIntoView().should('be.visible');
    cy.get('[data-cy="password-repeat-input"]').should('be.visible');
    cy.get('[data-cy="register-button"]').scrollIntoView();
    cy.get('[data-cy="register-button"]').should('be.visible');
    /* ==== End Cypress Studio ==== */
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('succesfull registration', function() {
    /* ==== Generated with Cypress Studio ==== */
    // randomize a number and append it to the email
    const random = Math.floor(Math.random() * 100000);
    cy.get('[data-cy="email-input"]').type(`test${random}@pv.pl`);
    cy.get('[data-cy="first-name-input"]').type('Test');
    cy.get('[data-cy="last-name-input"]').type('Testowski');
    cy.get('[data-cy="password-input"]').type('Test123!');
    cy.get('[data-cy="password-repeat-input"]').type('Test123!');
    cy.get('[data-cy="register-button"]').should('be.visible');
    cy.get('[data-cy="register-button"]').should('be.enabled');
    cy.get('[data-cy="register-button"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body').should('have.text', 'Registration successful');
    /* ==== End Cypress Studio ==== */
  });

})