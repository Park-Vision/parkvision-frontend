import {
    ADD_PARKING_SPOT,
    DELETE_PARKING_SPOT_SOFT,
    DELETE_PARKING_SPOT_HARD,
    UPDATE_PARKING_SPOT,
    GET_PARKING_SPOTS,
    GET_PARKING_SPOT,
    GET_PARKING_SPOTS_BY_PARKING_ID,
    GET_FREE_PARKING_SPOTS_BY_PARKING_ID,
    ADD_STAGED_PARKING_SPOT,
    GET_STAGED_PARKING_SPOTS_BY_PARKING_ID,
    GET_OCCUPIED_PARKING_SPOTS_MAP_BY_PARKING_ID
} from "../actions/types"

const initialState = {
    parkingSpots: [],
    freeParkingSpots: [],
    stagedParkingSpots: [],
    parkingSpot: {},
    occupiedParkingSpots: new Map(),
};

const parkingSpotReducer = (state = initialState, action) => {
    const {type} = action

    switch (type){
        case ADD_PARKING_SPOT:
            return {
                ...state,
                parkingSpots: [...state.parkingSpots, ...action.value], //This makes "flat" because endpoint returns array of parking spots
                parkingSpot: {},
                stagedParkingSpots: []
            }
        case GET_PARKING_SPOTS:
            return {
                ...state,
                parkingSpots: action.value
            }
        case GET_PARKING_SPOTS_BY_PARKING_ID:
            return {
                ...state,
                parkingSpots: action.value
            }
        case GET_FREE_PARKING_SPOTS_BY_PARKING_ID:
            return {
                ...state,
                freeParkingSpots: action.value
            }
        case GET_OCCUPIED_PARKING_SPOTS_MAP_BY_PARKING_ID:
            return {
                ...state,
                occupiedParkingSpots: action.value,
            };
        case GET_STAGED_PARKING_SPOTS_BY_PARKING_ID:
            return {
                ...state,
                stagedParkingSpots: action.value
            }
        case ADD_STAGED_PARKING_SPOT:
            return {
                ...state,
                stagedParkingSpots: [...state.stagedParkingSpots, action.value],
                parkingSpot: {}
            }
        case UPDATE_PARKING_SPOT:
            const parkingSpot = action.value
            return {
                ...state,
                parkingSpots: state.parkingSpots.map(item => item.id === parkingSpot.id ? parkingSpot : item ),
                parkingSpot: parkingSpot
            }
        case DELETE_PARKING_SPOT_SOFT:
            return {
                ...state,
                parkingSpots: state.parkingSpots.filter(item => item.id !== parseInt(action.value))
            }
        case DELETE_PARKING_SPOT_HARD:
            return {
                ...state,
                parkingSpots: state.parkingSpots.filter(item => item.id !== parseInt(action.value))
            }
        case GET_PARKING_SPOT:
            return {
                ...state,
                parkingSpot: action.value
            }
        default:
            return state;
    }
}

export default parkingSpotReducer;