import {ADD_DRONE, GET_DRONE, DELETE_DRONE, GET_DRONES, UPDATE_DRONE} from "../actions/types"

const initialState = [];

const droneReducer = (drones = initialState, action) => {
    const {type, payload} = action

    switch (type){
        case ADD_DRONE:
            return [...drones, payload];
        case GET_DRONES:
            return payload;
        case UPDATE_DRONE:
            return drones.map((drone) => {
                if (drone.id === payload.id){
                    return {
                        ...drones,
                        ...payload
                    }
                } else {
                    return drone
                }
            });
        case DELETE_DRONE:
            return drones.filter(({id}) => id !== payload.id);
        case GET_DRONE:
            return drones.filter(({id}) => id === payload.id);
        default:
            return drones;
    }
}

export default droneReducer;