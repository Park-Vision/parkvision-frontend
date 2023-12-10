describe('Tests for Car logic use cases', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/login');
        cy.get('#email').type('filipshelby@gmail.com');
        cy.get('#password').type('Filip123!');
        cy.get('form > [data-cy="login-button"]').should('be.enabled');
        cy.get('form > [data-cy="login-button"]').click();
        cy.get('.Toastify__toast-body > :nth-child(2)').should('have.text', 'Login successful');
    })

  it('adds new car', () => {
    cy.visit('http://localhost:3000/cars')

    
    cy.get('[data-cy="new-car-button"]').should('have.text', 'NEW CAR');
    cy.get('[data-cy="new-car-button"]').click();
    
    
    cy.get('[data-cy="registration-number"]').clear('DLU99913');
    cy.get('[data-cy="registration-number"]').type('DLU99913');
    cy.get('[data-cy="color"]').clear('WHITE');
    cy.get('[data-cy="color"]').type('WHITE');
    cy.get('[data-cy="brand"]').clear('TOYOTA');
    cy.get('[data-cy="brand"]').type('TOYOTA');
    cy.get('[data-cy="save-button"]').click();
    
    
    cy.get('[data-testid="DeleteIcon"] > path').should('be.visible');
    
    
    cy.get('[data-cy="car-registration"]').should('have.text', 'Registration number: DLU99913');
    cy.get('[data-cy="car-color"]').should('have.text', 'Color: WHITE');
    cy.get('[data-cy="car-brand"]').should('have.text', 'Brand: TOYOTA');
    cy.get('[data-testid="DeleteIcon"] > path').click();
    
  })
    
  it('adds and edits car', () => {
    cy.visit('http://localhost:3000/cars')
      
    cy.get('[data-cy="new-car-button"]').should('have.text', 'NEW CAR');
    cy.get('[data-cy="new-car-button"]').click();
    
    
    cy.get('[data-cy="registration-number"]').clear('DLU99913');
    cy.get('[data-cy="registration-number"]').type('DLU99913');
    cy.get('[data-cy="color"]').clear('WHITE');
    cy.get('[data-cy="color"]').type('WHITE');
    cy.get('[data-cy="brand"]').clear('TOYOTA');
    cy.get('[data-cy="brand"]').type('TOYOTA');
    cy.get('[data-cy="save-button"]').click();
    
    
    cy.get('[data-testid="DeleteIcon"] > path').should('be.visible');
    
    
    cy.get('[data-cy="car-registration"]').should('have.text', 'Registration number: DLU99913');
    cy.get('[data-cy="car-color"]').should('have.text', 'Color: WHITE');
    cy.get('[data-cy="car-brand"]').should('have.text', 'Brand: TOYOTA');
    
    cy.get('[data-cy="car-edit-button"]').should('be.visible');
    cy.get('[data-cy="car-edit-button"]').click();
    
    
    cy.get('[data-cy="registration-number"]').clear('DLU99913');
    cy.get('[data-cy="registration-number"]').type('DLU11111');
    cy.get('[data-cy="color"]').clear('WHITE');
    cy.get('[data-cy="color"]').type('BLACK');
    cy.get('[data-cy="brand"]').clear('TOYOTA');
    cy.get('[data-cy="brand"]').type('BMW');
    cy.get('[data-cy="save-button"]').click();
    
    
    cy.get('[data-cy="car-registration"]').should('have.text', 'Registration number: DLU11111');
    cy.get('[data-cy="car-color"]').should('have.text', 'Color: BLACK');
    cy.get('[data-cy="car-brand"]').should('have.text', 'Brand: BMW');
    cy.get('[data-testid="DeleteIcon"] > path').click();
    
  })


})