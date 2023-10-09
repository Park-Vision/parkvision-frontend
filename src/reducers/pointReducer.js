import {ADD_POINT, GET_POINT, DELETE_POINT, GET_POINTS, UPDATE_POINT} from "../actions/types"

const initialState = [];

const pointReducer = (points = initialState, action) => {
    const {type, payload} = action

    switch (type){
        case ADD_POINT:
            return [...points, payload];
        case GET_POINTS:
            return payload;
        case UPDATE_POINT:
            return points.map((point) => {
                if (point.id === payload.id){
                    return {
                        ...points,
                        ...payload
                    }
                } else {
                    return point
                }
            });
        case DELETE_POINT:
            return points.filter(({id}) => id !== payload.id);
        case GET_POINT:
            return points.filter(({id}) => id === payload.id);
        default:
            return points;
    }
}

export default pointReducer;