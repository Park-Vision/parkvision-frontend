import {
    ADD_PARKING,
    GET_PARKING,
    GET_PARKINGS,
    DELETE_PARKING,
    UPDATE_PARKING,
    GET_PARKINGS_NUM_OF_SPOTS,
    GET_PARKINGS_NUM_OF_FREE_SPOTS,
} from "../actions/types";

const initialState = {
    parkings: [],
    parking: {},
    numOfSpotsInParkings: {},
    numOfFreeSpotsInParkings: {},
};

const parkingReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case ADD_PARKING:
            return {
                ...state,
                parkings: [...state.parkings, action.value],
                parking: {},
            };
        case GET_PARKINGS:
            return {
                ...state,
                parkings: action.value,
            };
        case GET_PARKINGS_NUM_OF_SPOTS:
            let m1 = state.numOfSpotsInParkings;
            m1[action.parkingId] = action.value;
            return {
                ...state,
                numOfSpotsInParkings: m1,
            };
        case GET_PARKINGS_NUM_OF_FREE_SPOTS:
            let m2 = state.numOfFreeSpotsInParkings;
            m2[action.parkingId] = action.value;
            return {
                ...state,
                numOfFreeSpotsInParkings: m2,
            };
        case UPDATE_PARKING:
            const parking = action.value;
            return {
                ...state,
                parkings: state.parkings.map((item) => (item.id === parking.id ? parking : item)),
                parking: {},
            };
        case DELETE_PARKING:
            return {
                ...state,
                parkings: state.parkings.filter((item) => item.id !== parseInt(action.value)),
            };
        case GET_PARKING:
            return {
                ...state,
                parking: action.value,
            };
        default:
            return state;
    }
};

export default parkingReducer;
