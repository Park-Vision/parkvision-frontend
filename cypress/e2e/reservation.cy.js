describe('Reservation', () => {
  it('should redirect to login page if user is not logged in', () => {
    cy.viewport('iphone-8');
    cy.visit('http://localhost:3000/parking/1')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h4').should('be.visible');
    cy.get('.MuiTypography-h4').should('have.text', 'Magnolia Park');
    cy.get('.leaflet-container').should('be.visible');
    cy.get(':nth-child(8) > .MuiButtonBase-root').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'You must be logged in to make a reservation');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    /* ==== End Cypress Studio ==== */
  })


  /* ==== Test Created with Cypress Studio ==== */
  it('after successful login it should show to fill parking spot and registration number before clicking "Reserve"', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('#email').type('filipshelby@gmail.com');
    cy.get('#password').type('Filip123!');
    cy.get('form > [data-cy="login-button"]').should('be.enabled');
    cy.get('form > [data-cy="login-button"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Login successful');
    ;
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > .MuiPaper-root > :nth-child(1) > .MuiCardContent-root > .MuiTypography-h5').click();
    cy.get(':nth-child(8) > .MuiButtonBase-root').click();
    cy.get('#\\32  > .Toastify__toast-body > :nth-child(2)').should('have.text', 'Parking spot must be selected');
    cy.get('#\\33  > .Toastify__toast-body > :nth-child(2)').should('have.text', 'Registration number must be filled');
    /* ==== End Cypress Studio ==== */
  });
})