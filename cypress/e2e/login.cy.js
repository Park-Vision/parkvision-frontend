describe('Test Login logic', () => {
  it('renders login page', () => {
    cy.visit('http://localhost:3000/login')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiCardMedia-root').should('be.visible');
    cy.get('[data-cy="login-title"]').should('be.visible');
    cy.get('[data-cy="login-title"]').should('have.text', 'Login');
    cy.get('[data-cy="password-reset-button"]').scrollIntoView().should('be.visible');
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

    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#email').clear('f');
    cy.get('#email').type('filipshelby@gmail.com');
    cy.get('#password').clear();
    cy.get('#password').type('Filip123!');
    cy.get('form > [data-cy="login-button"]').should('be.enabled');
    cy.get('form > [data-cy="login-button"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Login successful');
    /* ==== End Cypress Studio ==== */
  });

  it('login invalid user', function () {
    cy.visit('http://localhost:3000/login');


    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#email').clear('test@pv.pl');
    cy.get('#email').type('test@pv.pl');
    cy.get('#password').clear('F');
    cy.get('#password').type('Filip123!');
    cy.get('form > [data-cy="login-button"]').should('be.enabled');
    cy.get('form > [data-cy="login-button"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Please enter valid email and password');
    /* ==== End Cypress Studio ==== */
  });

    it('disables login button if email is not valid', function () {
    cy.visit('http://localhost:3000/login');


    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#email').type('test#pv.pl');
    cy.get('#password').type('Filip123!');
    cy.get('form > [data-cy="login-button"]').should('be.disabled');
    /* ==== End Cypress Studio ==== */
  });

})