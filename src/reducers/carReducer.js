import {ADD_CAR, DELETE_CAR, UPDATE_CAR, GET_CARS, GET_CAR, GET_USER_CARS} from "../actions/types"

const initialState = {
    cars: [],
    car: {}
};

const carReducer = (state = initialState, action) => {
    const {type} = action

    switch (type){
        case ADD_CAR:
            return {
                ...state,
                cars: [...state.cars, action.value],
                car: {}
            }
        case GET_CARS:
            return {
                ...state,
                cars: action.value
            }
        case GET_USER_CARS:
            return {
                ...state,
                cars: action.value
            }
        case UPDATE_CAR:
            const car = action.value
            return {
                ...state,
                cars: state.cars.map(item => item.id === car.id ? car : item ),
                car: {}
            }
        case DELETE_CAR:
            return {
                ...state,
                cars: state.cars.filter(item => item.id !== parseInt(action.value))
            }
        case GET_CAR:
            return {
                ...state,
                car: action.value
            }
        default:
            return state;
    }
}

export default carReducer;