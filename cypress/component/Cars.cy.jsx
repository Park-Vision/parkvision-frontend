import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store from '../../src/store';
import Cars from '../../src/pages/Car/Cars';
import { GET_USER_CARS } from '../../src/redux/actions/types';

const carSelector = '[data-cy=car-item]';
const searchInputSelector = '[data-cy=search-input]';
const searchButton = '[data-cy=search-button]';

describe('Cars.cy.jsx', () => {
    beforeEach(() => {
        cy.viewport('macbook-15');


        cy.mount(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<Cars />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    });

    it('renders no parkings when there are no parkings', () => {
        // cy.window().then((win) => {
        //     win.store = store;

        //     const mockData =
        //         []

        //     win.store.dispatch({ type: GET_PARKINGS, value: mockData });
        // });

        // cy.get(parkingSelector)
        //     .should('have.length', 0);
    });

    it('renders the correct number of parking elements', () => {
        // cy.window().then((win) => {
        //     win.store = store;

        //     const mockData =
        //         [
        //             {
        //                 "id": 1,
        //                 "registrationNumber": "DW12345",
        //                 "color": "WHITE",
        //                 "brand": "BMW"
        //             },
        //         ]

        //     win.store.dispatch({ type: GET_USER_CARS, value: mockData });
        // });
        // cy.get(carSelector)
        //     .should('have.length', 1);
    });

    it('should render car', () => {


    });

});
