import {ADD_CAR, DELETE_CAR, UPDATE_CAR, GET_CARS, GET_CAR} from "../actions/types"

const initialState = [];

const carReducer = (cars = initialState, action) => {
    const {type, payload} = action

    switch (type){
        case ADD_CAR:
            return [...cars, payload];
        case GET_CARS:
            return payload;
        case UPDATE_CAR:
            return cars.map((car) => {
                if (car.id === payload.id){
                    return {
                        ...cars,
                        ...payload
                    }
                } else {
                    return car
                }
            });
        case DELETE_CAR:
            return cars.filter(({id}) => id !== payload.id);
        case GET_CAR:
            return cars.filter(({id}) => id === payload.id);
        default:
            return cars;
    }
}

export default carReducer;