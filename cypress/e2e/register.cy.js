describe('Register e2e', () => {
  beforeEach(() => {
    cy.viewport('iphone-8');
    cy.visit('http://localhost:3000/register');
  })

  it('renders', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiCardMedia-root').should('be.visible');
    cy.get('.MuiCardContent-root > .MuiTypography-h5').should('be.visible');
    cy.get('[data-cy="email-input"] > .MuiInputBase-root > #outlined-basic').should('be.visible');
    cy.get('[data-cy="first-name-input"] > .MuiInputBase-root > #outlined-basic').should('be.visible');
    cy.get('[data-cy="last-name-input"] > .MuiInputBase-root > #outlined-basic').should('be.visible');
    cy.get('[data-cy="password-input"] > .MuiInputBase-root > #outlined-basic').should('be.visible');
    cy.get('[data-cy="password-repeat-input"] > .MuiInputBase-root > #outlined-basic').should('be.visible');
    cy.get('[data-cy="register-button"]').scrollIntoView();
    cy.get('[data-cy="register-button"]').should('be.visible');
    cy.get('[data-cy="register-button"]').should('be.disabled');
    /* ==== End Cypress Studio ==== */
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('succesfull registration', function() {
    /* ==== Generated with Cypress Studio ==== */
    // randomize a number and append it to the email
    const random = Math.floor(Math.random() * 100000);
    cy.get('[data-cy="email-input"] > .MuiInputBase-root > #outlined-basic').clear(`test${random}@pv.pl`);
    cy.get('[data-cy="email-input"] > .MuiInputBase-root > #outlined-basic').type(`test${random}@pv.pl`);
    cy.get('[data-cy="first-name-input"] > .MuiInputBase-root > #outlined-basic').clear('T');
    cy.get('[data-cy="first-name-input"] > .MuiInputBase-root > #outlined-basic').type('Test');
    cy.get('[data-cy="last-name-input"] > .MuiInputBase-root > #outlined-basic').clear();
    cy.get('[data-cy="last-name-input"] > .MuiInputBase-root > #outlined-basic').type('Testowski');
    cy.get('[data-cy="password-input"] > .MuiInputBase-root > #outlined-basic').clear('T');
    cy.get('[data-cy="password-input"] > .MuiInputBase-root > #outlined-basic').type('Test123!');
    cy.get('[data-cy="password-repeat-input"] > .MuiInputBase-root > #outlined-basic').clear();
    cy.get('[data-cy="password-repeat-input"] > .MuiInputBase-root > #outlined-basic').type('Test123!');
    cy.get('[data-cy="register-button"]').should('be.visible');
    cy.get('[data-cy="register-button"]').should('be.enabled');
    cy.get('[data-cy="register-button"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body').should('have.text', 'Registration successful');
    /* ==== End Cypress Studio ==== */
  });


  // it should regitser button be disabled if passwords are not the same
  it('should register button be disabled if passwords are not the same', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="email-input"] > .MuiInputBase-root > #outlined-basic').clear('testpassword@pv.pl');
    cy.get('[data-cy="email-input"] > .MuiInputBase-root > #outlined-basic').type('testpassword@pv.pl');
    cy.get('[data-cy="first-name-input"] > .MuiInputBase-root > #outlined-basic').clear('T');
    cy.get('[data-cy="first-name-input"] > .MuiInputBase-root > #outlined-basic').type('Test');
    cy.get('[data-cy="last-name-input"] > .MuiInputBase-root > #outlined-basic').clear();
    cy.get('[data-cy="last-name-input"] > .MuiInputBase-root > #outlined-basic').type('Testowski');
    cy.get('[data-cy="password-input"] > .MuiInputBase-root > #outlined-basic').clear('T');
    cy.get('[data-cy="password-input"] > .MuiInputBase-root > #outlined-basic').type('Test123!');
    cy.get('[data-cy="password-repeat-input"] > .MuiInputBase-root > #outlined-basic').clear();
    cy.get('[data-cy="password-repeat-input"] > .MuiInputBase-root > #outlined-basic').type('Test123');
    cy.get('[data-cy="register-button"]').should('be.visible');
    cy.get('[data-cy="register-button"]').should('be.disabled');
    /* ==== End Cypress Studio ==== */
  });
})