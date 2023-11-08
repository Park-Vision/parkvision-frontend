import { act } from "react-dom/test-utils";
import { REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from "../actions/types";
import decodeToken from "../utils/decodeToken";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
    ? { isLoggedIn: true, user, decodedUser: decodeToken(user.token) }
    : { isLoggedIn: false, user: null, decodedUser: null };

const authenticationReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: action.value.data.token,
                decodedUser: decodeToken(action.value.data.token),
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                decodedUser: null,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                decodedUser: null,
            };
        default:
            return state;
    }
};

export default authenticationReducer;
