import {ADD_PARKING_SPOT, DELETE_PARKING_SPOT_SOFT, DELETE_PARKING_SPOT_HARD,
    UPDATE_PARKING_SPOT, GET_PARKING_SPOTS, GET_PARKING_SPOT} from "../actions/types"

const initialState = [];

const parkingSpotReducer = (parkingSpots = initialState, action) => {
    const {type, payload} = action

    switch (type){
        case ADD_PARKING_SPOT:
            return [...parkingSpots, payload];
        case GET_PARKING_SPOTS:
            return payload;
        case UPDATE_PARKING_SPOT:
            return parkingSpots.map((parkingSpot) => {
                if (parkingSpot.id === payload.id){
                    return {
                        ...parkingSpots,
                        ...payload
                    }
                } else {
                    return parkingSpot
                }
            });
        case DELETE_PARKING_SPOT_SOFT:
            return parkingSpots.filter(({id}) => id !== payload.id);
        case DELETE_PARKING_SPOT_HARD:
            return parkingSpots.filter(({id}) => id !== payload.id);
        case GET_PARKING_SPOT:
            return parkingSpots.filter(({id}) => id === payload.id);
        default:
            return parkingSpots;
    }
}

export default parkingSpotReducer;