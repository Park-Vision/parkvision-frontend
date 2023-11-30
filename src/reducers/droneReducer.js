import {ADD_DRONE, GET_DRONE, DELETE_DRONE, GET_DRONES, UPDATE_DRONE} from "../actions/types"

const initialState = {
    drones: [],
    drone: {}
};

const droneReducer = (state = initialState, action) => {
    const {type} = action

    switch (type){
        case ADD_DRONE:
            return {
                ...state,
                drones: [...state.drones, action.value],
                drone: {}
            }
        case GET_DRONES:
            return {
                ...state,
                drones: action.value
            }
        case UPDATE_DRONE:
            const drone = action.value
            return {
                ...state,
                drones: state.drones.map(item => item.id === drone.id ? drone : item ),
                drone: {}
            }
        case DELETE_DRONE:
            return {
                ...state,
                drones: state.drones.filter(item => item.id !== parseInt(action.value))
            }
        case GET_DRONE:
            return {
                ...state,
                drone: action.value
            }
        default:
            return state;
    }
}

export default droneReducer;