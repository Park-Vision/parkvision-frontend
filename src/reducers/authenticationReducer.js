import { act } from "react-dom/test-utils";
import { REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from "../actions/types";

const decodeToken = (token) => {
    if (typeof token !== "string" || !token) {
        return null;
    }
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
        return null;
    }
    return JSON.parse(atob(tokenParts[1]));
};

const user = JSON.parse(localStorage.getItem("user"));
const decodedUser = decodeToken(user?.token);
const initialState = user
    ? { isLoggedIn: true, user, decodedUser }
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
                user: action.value,
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
