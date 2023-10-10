import {ADD_PARKING, GET_PARKING, GET_PARKINGS, DELETE_PARKING, UPDATE_PARKING} from "../actions/types"

const initialState = {
    parkings: [],
    parking: {}
};

const parkingReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch (type){
        case ADD_PARKING:
            return {
                ...state,
                parkings: [...state.parkings, action.value],
                parking: {}
            }
        case GET_PARKINGS:
            return {
                ...state,
                parkings: action.value
            }
        case UPDATE_PARKING:
            const parking = action.value
            return {
                ...state,
                parkings: state.parkings.map(item => item.id === parking.id ? parking : item ),
                parking: {}
            }
        case DELETE_PARKING:
            return {
                ...state,
                parkings: state.parkings.filter(item => item.id !== parseInt(action.value))
            }
        case GET_PARKING:
            return {
                ...state,
                parking: action.value
            }
        default:
            return state;
    }
}

export default parkingReducer;