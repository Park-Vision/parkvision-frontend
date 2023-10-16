import {ADD_POINT, GET_POINT, DELETE_POINT, GET_POINTS, UPDATE_POINT} from "../actions/types"

const initialState = {
    points: [],
    point: {}
};

const pointReducer = (state = initialState, action) => {
    const {type} = action

    switch (type){
        case ADD_POINT:
            return {
                ...state,
                points: [...state.point, action.value],
                point: {}
            }
        case GET_POINTS:
            return {
                ...state,
                points: action.value
            }
        case UPDATE_POINT:
            const point = action.value
            return {
                ...state,
                points: state.points.map(item => item.id === point.id ? point : item ),
                point: {}
            }
        case DELETE_POINT:
            return {
                ...state,
                points: state.points.filter(item => item.id !== parseInt(action.value))
            }
        case GET_POINT:
            return {
                ...state,
                point: action.value
            }
        default:
            return state;
    }
}

export default pointReducer;