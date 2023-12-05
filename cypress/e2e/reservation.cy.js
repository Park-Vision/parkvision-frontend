describe('Reservation', () => {
  it('should redirect to login page if user is not logged in', () => {
    cy.viewport('iphone-8');
    cy.visit('http://localhost:3000/parking/1')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h4').should('be.visible');
    cy.get('.MuiTypography-h4').should('have.text', 'Magnolia Park');
    cy.get('.MuiPaper-root > :nth-child(1) > .MuiTypography-h5').should('have.text', 'Available: 0/2');
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
  it('Reservation', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('#\\:r0\\:').clear('filipshelby@gmail.com');
    cy.get('#\\:r0\\:').type('filipshelby@gmail.com');
    cy.get('#\\:r1\\:').clear('F');
    cy.get('#\\:r1\\:').type('Filip123!');
    cy.get('[data-cy="login-button"]').should('be.enabled');
    cy.get('[data-cy="login-button"]').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Login successful');
    cy.get(':nth-child(1) > .MuiPaper-root > [style="padding: 20px 0px 20px 20px;"] > .MuiCardContent-root > .MuiTypography-gutterBottom').click();
    cy.get('[data-cy="start-date"] > :nth-child(2) > .MuiDayCalendar-root > .MuiPickersSlideTransition-root > .MuiDayCalendar-monthContainer > [aria-rowindex="5"] > [data-timestamp="1701039600000"]').click();
    cy.get('#outlined-basic').clear('1');
    cy.get('#outlined-basic').type('1');
    cy.get('#\\:r7\\:').clear('D');
    cy.get('#\\:r7\\:').type('DLU12321');
    cy.get(':nth-child(8) > .MuiButtonBase-root').click();
    cy.get('.css-1hj4q09-MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').clear('4242424242424242');
    cy.get('.css-1hj4q09-MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('4242424242424242');
    cy.get('[style="display: flex;"] > :nth-child(1) > .MuiInputBase-input').clear('1');
    cy.get('[style="display: flex;"] > :nth-child(1) > .MuiInputBase-input').type('12');
    cy.get(':nth-child(3) > .MuiInputBase-input').clear('3');
    cy.get(':nth-child(3) > .MuiInputBase-input').type('34');
    cy.get('[style="display: flex; max-width: 100%;"] > .MuiInputBase-root > .MuiInputBase-input').clear('12');
    cy.get('[style="display: flex; max-width: 100%;"] > .MuiInputBase-root > .MuiInputBase-input').type('123');
    cy.get('.MuiButton-contained').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Reservation created');
    /* ==== End Cypress Studio ==== */
  });
})