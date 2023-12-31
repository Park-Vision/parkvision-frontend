import { Provider } from 'react-redux'
import Login from '../../src/pages/Login/Login'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import store from "../../src/store";
import App from '../../src/App';

const loginButtonSelector = '[data-cy=login-button]';
const passwordResetButtonSelector = '[data-cy=password-reset-button]';
const registerButtonSelector = '[data-cy=register-button]';
const emailInputSelector = '[data-cy=email-input]';
const passwordInputSelector = '[data-cy=password-input]';
const loginTitleSelector = '[data-cy=login-title]';
const sendPasswordResetButtonSelector = '[data-cy=send-password-reset-button]';
const passwordResetTitleSelector = '[data-cy=password-reset-title]';
const passwordResetEmailInputSelector = '[data-cy=password-reset-email-input]';

describe('Login.cy.jsx', () => {
  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.mount(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              path="*"
              element={<Login />}
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  });

  it('renders', () => {
    cy.get(loginTitleSelector).should('exist');
    cy.get(loginTitleSelector).should('contain', 'Login');
    cy.get(loginButtonSelector).should('exist');
    cy.get(passwordResetButtonSelector).should('exist');
    cy.get(registerButtonSelector).should('exist');
    cy.get(emailInputSelector).should('exist');
    cy.get(passwordInputSelector).should('exist');
  });

  it('has empty login form', () => {
    cy.get(emailInputSelector).should('have.value', '');
    cy.get(passwordInputSelector).should('have.value', '');
  });

  it('has enabled login button', () => {
    cy.get(loginButtonSelector).should('be.enabled');
  });

  it('enables login button after valid email and password', () => {
    cy.get(emailInputSelector).type('test@pv.pl');
    cy.get(passwordInputSelector).type('Test123!');

    cy.get(loginButtonSelector).should('be.enabled');
  });


  it('should enable send password reset button if email is valid', () => {
    cy.get(passwordResetButtonSelector).click();
    cy.get(passwordResetEmailInputSelector).type('test@pv.pl');
    cy.get(sendPasswordResetButtonSelector).should('be.enabled');
  });

});
