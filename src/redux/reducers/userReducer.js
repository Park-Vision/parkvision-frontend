import {
    ADD_USER,
    UPDATE_USER,
    GET_USER,
    DELETE_USER,
    AUTHENTICATE_USER,
    GET_USERS,
    REGISTER_USER,
    UPDATE_NAME,
    UPDATE_PASSWORD,
    DISABLE_USER,
    GET_MANAGERS,
    ASSIGN_PARKING
} from "../actions/types"

const initialState = {
    users: [],
    user: {}
};

const userReducer = (state = initialState, action) => {
    const {type} = action

    switch (type){
        case ADD_USER:
            return {
                ...state,
                users: [...state.user, action.value],
                user: {}
            }
        case GET_USERS:
            return {
                ...state,
                users: action.value
            }
        case GET_MANAGERS:
            return {
                ...state,
                users: action.value
            }
        case UPDATE_USER:
            const user = action.value
            return {
                ...state,
                users: state.points.map(item => item.id === user.id ? user : item ),
                user: {}
            }
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(item => item.id !== parseInt(action.value))
            }
        case GET_USER:
            return {
                ...state,
                user: action.value
            }
        case AUTHENTICATE_USER:
            return {
                ...state,
                users: [...state.user, action.value],
                user: {}
            }
        case REGISTER_USER:
            return {
                ...state,
                users: [...state.user, action.value],
                user: {}
            }
        case UPDATE_NAME:
            return {
                ...state,
                user: action.value
            }
        case UPDATE_PASSWORD:
            return {
                ...state,
                user: action.value
            }
        case DISABLE_USER:
            return {
                ...state,
                users: state.users.filter(item => item.id !== parseInt(action.value))
            }
        case ASSIGN_PARKING:
            return {
                ...state,
                user: action.value
            }
        default:
            return state;
    }
}

export default userReducer;