import {ADD_USER, UPDATE_USER, GET_USER, DELETE_USER,
    AUTHENTICATE_USER, GET_USERS, REGISTER_USER} from "../actions/types"

const initialState = [];

const userReducer = (users = initialState, action) => {
    const {type, payload} = action

    switch (type){
        case ADD_USER:
            return [...users, payload];
        case GET_USERS:
            return payload;
        case UPDATE_USER:
            return users.map((user) => {
                if (user.id === payload.id){
                    return {
                        ...users,
                        ...payload
                    }
                } else {
                    return user
                }
            });
        case DELETE_USER:
            return users.filter(({id}) => id !== payload.id);
        case GET_USER:
            return users.filter(({id}) => id === payload.id);
        case AUTHENTICATE_USER:
            return [...users, payload];
        case REGISTER_USER:
            return [...users, payload];
        default:
            return users;
    }
}

export default userReducer;