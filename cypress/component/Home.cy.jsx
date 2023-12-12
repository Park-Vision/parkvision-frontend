import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store from '../../src/store';
import Home from '../../src/pages/Home/Home';
import { GET_PARKINGS } from '../../src/redux/actions/types';

const parkingSelector = '[data-cy=parking-item]';
const searchInputSelector = '[data-cy=search-input]';
const searchButton = '[data-cy=search-button]';

describe('Home.cy.jsx', () => {
    beforeEach(() => {
        cy.viewport('macbook-15');


        cy.mount(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    });

    it('renders no parkings when there are no parkings', () => {
        cy.window().then((win) => {
            win.store = store;

            const mockData =
                []

            win.store.dispatch({ type: GET_PARKINGS, value: mockData });
        });

        cy.get(parkingSelector)
            .should('have.length', 0);
    });

    it('renders the correct number of parking elements', () => {
        cy.window().then((win) => {
            win.store = store;

            const mockData =
                [
                    {
                        "id": 2,
                        "name": "D20 - Politechnika Wrocławska",
                        "description": "Parking D20 to parking dla studentów i pracowników Politechniki Wrocławskiej. Posiada 50 miejsc parkingowych, w tym 2 miejsca dla osób niepełnosprawnych. Parking jest monitorowany przez 24 godziny na dobę.",
                        "city": "Wrocław",
                        "street": "Janiszewskiego 8",
                        "zipCode": "50-372",
                        "costRate": 3,
                        "startTime": "04:30-03:00",
                        "endTime": "21:00-03:00",
                        "latitude": 51.10975855141324,
                        "longitude": 17.059114686292222,
                        "timeZone": "-03:00",
                        "currency": "EUR"
                    },
                    {
                        "id": 3,
                        "name": "Parking Wrońskiego",
                        "description": "Parking Wrońskiego to parking Politechniki Wrocławskiej dla studentów i pracowników Politechniki Wrocławskiej. Posiada 50 miejsc parkingowych, w tym 2 miejsca dla osób niepełnosprawnych.",
                        "city": "Wrocław",
                        "street": "Wrońskiego 1",
                        "zipCode": "50-376",
                        "costRate": 2,
                        "startTime": "06:30-02:00",
                        "endTime": "19:00-02:00",
                        "latitude": 51.108915212046774,
                        "longitude": 17.05562300818793,
                        "timeZone": "-02:00",
                        "currency": "PLN"
                    },
                    {
                        "id": 1,
                        "name": "Magnolia Park",
                        "description": "Parking Magnolia Park to parking znajdujący się w centrum Wrocławia. Posiada 100 miejsc parkingowych, w tym 5 miejsc dla osób niepełnosprawnych. Parking jest monitorowany przez 24 godziny na dobę.",
                        "city": "Wrocław",
                        "street": "Legnicka 58",
                        "zipCode": "54-204",
                        "costRate": 2.5,
                        "startTime": "06:00-03:00",
                        "endTime": "22:00-03:00",
                        "latitude": 51.11818354620572,
                        "longitude": 16.990429400497433,
                        "timeZone": "-03:00",
                        "currency": "PLN"
                    }
                ]

            win.store.dispatch({ type: GET_PARKINGS, value: mockData });
        });
        cy.get(parkingSelector)
            .should('have.length', 3);
    });

    it('should render only one parking after search', () => {
        cy.get(searchInputSelector).type('Magnolia Park');

        cy.get(searchButton).click();
        cy.get(parkingSelector)
            .should('have.length', 1);

        cy.get(parkingSelector).should('contain', 'Magnolia Park');

        cy.get(searchInputSelector).clear();

        cy.get(parkingSelector)
            .should('have.length', 3);



    });

});
