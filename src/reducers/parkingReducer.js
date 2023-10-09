import {ADD_PARKING, GET_PARKING, GET_PARKINGS, DELETE_PARKING, UPDATE_PARKING} from "../actions/types"

const initialState = [];

const parkingReducer = (parkings = initialState, action) => {
    const {type, payload} = action

    switch (type){
        case ADD_PARKING:
            return [...parkings, payload];
        case GET_PARKINGS:
            return payload;
        case UPDATE_PARKING:
            return parkings.map((parking) => {
                if (parking.id === payload.id){
                    return {
                        ...parkings,
                        ...payload
                    }
                } else {
                    return parking
                }
            });
        case DELETE_PARKING:
            return parkings.filter(({id}) => id !== payload.id);
        case GET_PARKING:
            return parkings.filter(({id}) => id === payload.id);
        default:
            return parkings;
    }
}

export default parkingReducer;