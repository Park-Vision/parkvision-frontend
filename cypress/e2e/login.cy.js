describe('template spec', () => {
  it('renders login page', () => {
    cy.visit('http://localhost:3000/login')
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

  /* ==== Test Created with Cypress Studio ==== */
  it('login invalid user', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('#\\:r0\\:').clear('u');
    cy.get('#\\:r0\\:').type('invalidmail');
    cy.get('#\\:r1\\:').clear();
    cy.get('#\\:r1\\:').type('invalidpassword');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[type="submit"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Please enter valid email and password');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('login invalid password user', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('#\\:r0\\:').clear('filipshelby@gmail.com');
    cy.get('#\\:r0\\:').type('filipshelby@gmail.com');
    cy.get('#\\:r1\\:').clear('F');
    cy.get('#\\:r1\\:').type('Filip123!!');
    cy.get('[type="submit"]').click();
    cy.get('.Toastify__toast-icon > svg').should('be.visible');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Please enter valid email and password');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('login no pass user', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('[type="submit"]').click();
    cy.get('#\\:r0\\:').should('be.enabled');
    /* ==== End Cypress Studio ==== */
  });
})