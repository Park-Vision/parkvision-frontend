import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store from '../../src/store';
import Register from '../../src/pages/Login/Register';

const registerButtonSelector = '[data-cy=register-button]';
const emailInputSelector = '[data-cy=email-input]';
const passwordInputSelector = '[data-cy=password-input]';
const passwordRepeatInputSelector = '[data-cy=password-repeat-input]';
const firstNameInputSelector = '[data-cy=first-name-input]';
const lastNameInputSelector = '[data-cy=last-name-input]';

describe('Register.cy.jsx', () => {
  beforeEach(() => {
    cy.viewport('iphone-8');
    cy.mount(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  });

  it('renders', () => {
    cy.get(registerButtonSelector).should('exist');
    cy.get(emailInputSelector).should('exist');
    cy.get(passwordInputSelector).should('exist');
    cy.get(passwordRepeatInputSelector).should('exist');
    cy.get(firstNameInputSelector).should('exist');
    cy.get(lastNameInputSelector).should('exist');
  });

  it('has empty registration form', () => {
    cy.get(emailInputSelector).should('have.value', '');
    cy.get(passwordInputSelector).should('have.value', '');
    cy.get(passwordRepeatInputSelector).should('have.value', '');
    cy.get(firstNameInputSelector).should('have.value', '');
    cy.get(lastNameInputSelector).should('have.value', '');
  });

  it('has disabled register button', () => {
    cy.get(registerButtonSelector).should('be.disabled');
  });

  it('enables register button after valid input', () => {
    cy.get(emailInputSelector).type('test@pv.pl');
    cy.get(passwordInputSelector).type('Test123!');
    cy.get(passwordRepeatInputSelector).type('Test123!');
    cy.get(firstNameInputSelector).type('John');
    cy.get(lastNameInputSelector).type('Doe');

    cy.get(registerButtonSelector).should('be.enabled');
  });

  it('disables register button after invalid input', () => {
    cy.get(emailInputSelector).type('test#pv.pl');
    cy.get(passwordInputSelector).type('Test123!');
    cy.get(passwordRepeatInputSelector).type('Test123!');
    cy.get(firstNameInputSelector).type('John');
    cy.get(lastNameInputSelector).type('Doe');

    cy.get(registerButtonSelector).should('be.disabled');
  }
  );
});
