import {
    ADD_RESERVATION,
    DELETE_RESERVATION,
    GET_RESERVATION,
    UPDATE_RESERVATION,
    GET_RESERVATIONS, GET_USER_RESERVATIONS, GET_PARKING_RESERVATIONS,
} from "../actions/types";

const initialState = {
    reservationsPending: [],
    reservationsArchived: [],
    reservations: [],
    reservation: {},
};

const reservationReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case ADD_RESERVATION:
            return {
                ...state,
                reservationsPending: [...state.reservationsPending, action.value],
                reservations: [...state.reservations, action.value],
                reservation: action.value,
            };
        case GET_RESERVATIONS:
            return {
                ...state,
                reservationsPending: action.value.Pending,
                reservationsArchived: action.value.Archived,
            };
        case GET_USER_RESERVATIONS:
            return {
                ...state,
                reservationsPending: action.value.Pending,
                reservationsArchived: action.value.Archived,
            };
        case UPDATE_RESERVATION:
            const reservation = action.value;
            return {
                ...state,
                reservationsPending: state.reservationsPending.map((item) => {
                    if (item.id === reservation.id) {
                        return reservation;
                    }
                    return item;
                }),
                reservationsArchived: state.reservationsArchived.map((item) => {
                    if (item.id === reservation.id) {
                        return reservation;
                    }
                    return item;
                }),
                reservations: state.reservations.map((item) => {
                    if (item.id === reservation.id) {
                        return reservation;
                    }
                    return item;
                })
            };
        case DELETE_RESERVATION:
            return {
                ...state,
                reservationsPending: state.reservationsPending.filter(
                    (item) => item.id !== action.value
                ),
                reservationsArchived: state.reservationsArchived.filter(
                    (item) => item.id !== action.value
                ),
                reservations: state.reservations.filter(
                    (item) => item.id !== action.value
                ),
            };
        case GET_RESERVATION:
            return {
                ...state,
                reservation: action.value,
            };
        case GET_PARKING_RESERVATIONS:
            return {
                ...state,
                reservations: action.value,
            };
        default:
            return state;
    }
};

export default reservationReducer;
