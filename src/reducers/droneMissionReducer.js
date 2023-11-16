import {
    ADD_DRONE_MISSION,
    GET_DRONE_MISSION,
    DELETE_DRONE_MISSION,
    GET_DRONE_MISSIONS,
    UPDATE_DRONE_MISSION,
} from "../actions/types";

const initialState = {
    droneMissions: [],
    droneMission: {},
};

const droneMissionReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case ADD_DRONE_MISSION:
            return {
                ...state,
                droneMissions: [...state.droneMissions, action.value],
                droneMission: {},
            };
        case GET_DRONE_MISSIONS:
            return {
                ...state,
                droneMissions: action.value,
            };
        case UPDATE_DRONE_MISSION:
            const updatedDroneMission = action.value;
            return {
                ...state,
                droneMissions: state.droneMissions.map((item) =>
                    item.id === updatedDroneMission.id ? updatedDroneMission : item
                ),
                droneMission: {},
            };
        case DELETE_DRONE_MISSION:
            return {
                ...state,
                droneMissions: state.droneMissions.filter(
                    (item) => item.id !== parseInt(action.value)
                ),
            };
        case GET_DRONE_MISSION:
            return {
                ...state,
                droneMission: action.value,
            };
        default:
            return state;
    }
};

export default droneMissionReducer;