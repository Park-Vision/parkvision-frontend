import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store from '../../src/store';
import { GET_USER, LOGIN_SUCCESS } from '../../src/redux/actions/types';
import AppBar from '../../src/components/AppBar';

const homeSelector = '[data-cy=Home]';
const contactSelector = '[data-cy=Contact]';
const aboutSelector = '[data-cy=About]';
const loginSelector = '[data-cy=login]';

const menuSelector = '[data-cy=menu]';

describe('AppBar.cy.jsx', () => {
    beforeEach(() => {


        cy.mount(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<AppBar />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    });

    it('renders items inside menu', () => {
        cy.viewport('iphone-8');
        cy.get(menuSelector).should('exist');
        cy.get(homeSelector).should('exist');
        cy.get(contactSelector).should('exist');
        cy.get(aboutSelector).should('exist');
        cy.get(loginSelector).should('exist');
    });

    it('renders items directly on appbar', () => {
        cy.viewport('macbook-16');

        cy.get(menuSelector).should('exist');
        cy.get(homeSelector).should('exist');
        cy.get(contactSelector).should('exist');
        cy.get(aboutSelector).should('exist');
        cy.get(loginSelector).should('exist');
    });

    it('opens menu on click', () => {
        cy.viewport('iphone-8');

        cy.get(menuSelector).should('exist');
        cy.get(homeSelector).should('exist');
        cy.get(contactSelector).should('exist');
        cy.get(aboutSelector).should('exist');
        cy.get(loginSelector).should('exist');

        // menu items should not be visible
        cy.get(homeSelector).should('not.be.visible');
        cy.get(contactSelector).should('not.be.visible');
        cy.get(aboutSelector).should('not.be.visible');
        cy.get(loginSelector).should('not.be.visible');

        cy.get(menuSelector).click();

        // menu items should be visible
        cy.get(homeSelector).should('be.visible');
        cy.get(contactSelector).should('be.visible');
        cy.get(aboutSelector).should('be.visible');
        cy.get(loginSelector).should('be.visible');

    });


    it('renders profile menu', () => {
        cy.window().then((win) => {
            win.store = store;

            // const mockData = {
            //     "id": 1,
            //     "email": "filip.strozik@pv.pl",
            //     "firstName": "Filip",
            //     "lastName": "Strózik",
            //     "role": "USER",
            //     "parkingDTO": null
            // }
            // win.store.dispatch({ type: GET_USER, value: mockData });

            // const mockLoginData = {
            //     token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmaWxpcHNoZWxieUBnbWFpbC5jb20iLCJ1c2VySWQiOiI4Iiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MDE3ODE5MDUsImV4cCI6MTcwMTc4NTUwNX0.7ttaqo1k8TEPQvYw6rW2xfPt42UxevLOk-YLRXDA6ec"
            // }

            // win.store.dispatch({ type: LOGIN_SUCCESS, value: mockLoginData });

        });

    });
});
