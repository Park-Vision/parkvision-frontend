import {REGISTER_SUCCESS, REGISTER_USER, REGISTER_FAIL, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT} from "./types"

import AuthenticationService from "../services/AuthenticationService";

export const register = (email, firstName, lastName, password) => (dispatch) => {
    try {
        const response = AuthenticationService.register(email, firstName, lastName, password)
        dispatch({
            type: REGISTER_SUCCESS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        dispatch({
            type: REGISTER_FAIL
        })
        return Promise.reject(error)
    }
};

export const login = (email, password) => (dispatch) => {
    try {
        const response = AuthenticationService.login(email, password)
        dispatch({
            type: REGISTER_SUCCESS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        dispatch({
            type: LOGIN_FAIL
        })
        return Promise.reject(error)
    }
};

export const logout = () => (dispatch) => {
    AuthenticationService.logout();

    dispatch({
        type: LOGOUT,
    });
};
