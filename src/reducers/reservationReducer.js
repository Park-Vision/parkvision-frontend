import {
    ADD_RESERVATION,
    DELETE_RESERVATION,
    GET_RESERVATION,
    UPDATE_RESERVATION,
    GET_RESERVATIONS, GET_USER_RESERVATIONS, GET_PARKING_RESERVATIONS,
} from "../actions/types";

const initialState = {
    reservations: [],
    reservation: {},
};

const reservationReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case ADD_RESERVATION:
            return {
                ...state,
                reservations: [...state.reservations, action.value],
                reservation: action.value,
            };
        case GET_RESERVATIONS:
            return {
                ...state,
                reservations: action.value,
            };
        case GET_USER_RESERVATIONS:
            return {
                ...state,
                reservations: action.value,
            };
        case UPDATE_RESERVATION:
            const reservation = action.value;
            return {
                ...state,
                reservations: state.reservations.map((item) => (item.id === reservation.id ? reservation : item)),
                reservation: {},
            };
        case DELETE_RESERVATION:
            return {
                ...state,
                reservations: state.reservations.filter((item) => item.id !== parseInt(action.value)),
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
