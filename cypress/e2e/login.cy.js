describe('template spec', () => {
  it('renders login page', () => {
    cy.visit('http://localhost:3000/login')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiCardMedia-root').should('be.visible');
    cy.get('[data-cy="login-title"]').should('be.visible');
    cy.get('[data-cy="login-title"]').should('have.text', 'Login');
    cy.get('#\\:r0\\:').should('be.visible');
    cy.get('#\\:r1\\:').should('be.enabled');
    cy.get('[data-cy="password-reset-button"]').should('be.visible');
    cy.get('[data-cy="password-reset-button"]').should('be.enabled');
    cy.get('[data-cy="login-button"]').should('be.disabled');
    cy.get('[data-cy="register-button"]').should('be.visible');
    cy.get('[data-cy="register-button"]').should('be.enabled');
    /* ==== End Cypress Studio ==== */
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('login valid user', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('.MuiCardMedia-root').should('be.visible');
    cy.get('.MuiCardContent-root > .MuiTypography-h5').should('be.visible');
    cy.get('#\\:r0\\:-label').should('be.visible');
    cy.get('#\\:r1\\:').should('be.visible');
    cy.get('[type="submit"]').should('be.visible');
    cy.get('form > .MuiButton-text').should('be.visible');
    cy.get('form > :nth-child(5)').should('be.visible');
    cy.get('#\\:r0\\:').clear('f');
    cy.get('#\\:r0\\:').type('filipshelby@gmail.com');
    cy.get('#\\:r1\\:').clear('F');
    cy.get('#\\:r1\\:').type('Filip123!');
    cy.get('[type="submit"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('#\\31 ').should('be.visible');
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Login successful');
    /* ==== End Cypress Studio ==== */
  });

  it('login invalid user', function () {
    cy.visit('http://localhost:3000/login');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('#\\:r0\\:').clear('test@pv.pl');
    cy.get('#\\:r0\\:').type('test@pv.pl');
    cy.get('#\\:r1\\:').clear('F');
    cy.get('#\\:r1\\:').type('Filip123!');
    cy.get('[data-cy="login-button"]').should('be.enabled');
    cy.get('[data-cy="login-button"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Please enter valid email and password');
    /* ==== End Cypress Studio ==== */
  });

})