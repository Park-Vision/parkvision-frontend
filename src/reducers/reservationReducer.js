import {ADD_RESERVATION, DELETE_RESERVATION, GET_RESERVATION,
    UPDATE_RESERVATION, GET_RESERVATIONS} from "../actions/types"

const initialState = [];

const reservationReducer = (reservations = initialState, action) => {
    const {type, payload} = action

    switch (type){
        case ADD_RESERVATION:
            return [...reservations, payload];
        case GET_RESERVATIONS:
            return payload;
        case UPDATE_RESERVATION:
            return reservations.map((reservation) => {
                if (reservation.id === payload.id){
                    return {
                        ...reservations,
                        ...payload
                    }
                } else {
                    return reservation
                }
            });
        case DELETE_RESERVATION:
            return reservations.filter(({id}) => id !== payload.id);
        case GET_RESERVATION:
            return reservations.filter(({id}) => id === payload.id);
        default:
            return reservations;
    }
}

export default reservationReducer;