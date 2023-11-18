describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/parking/1')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h4').should('be.visible');
    cy.get('.MuiTypography-h4').should('have.text', 'Magnolia Park');
    cy.get('.MuiPaper-root > :nth-child(1) > .MuiTypography-h5').should('have.text', 'Available: 2/2');
    cy.get('.leaflet-container').should('be.visible');
    cy.get(':nth-child(8) > .MuiButtonBase-root').click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'You must be logged in to make a reservation');
    /* ==== End Cypress Studio ==== */
  })
})