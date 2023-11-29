import { REGISTER_SUCCESS, REGISTER_USER, REGISTER_FAIL, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from "./types";

import AuthenticationService from "../services/AuthenticationService";

export const register = (email, firstName, lastName, password) => async (dispatch) => {
    try {
        const response = await AuthenticationService.register(email, firstName, lastName, password);
        dispatch({
            type: REGISTER_SUCCESS,
            value: response,
        });
        return Promise.resolve(response);
    } catch (error) {
        dispatch({
            type: REGISTER_FAIL,
        });
        return Promise.reject(error);
    }
};

export const registerManager = (email, firstName, lastName, password) => async (dispatch) => {
    try {
        const response = await AuthenticationService.registerManager(email, firstName, lastName, password);
        dispatch({
            type: REGISTER_SUCCESS,
            value: response,
        });
        return Promise.resolve(response);
    } catch (error) {
        dispatch({
            type: REGISTER_FAIL,
        });
        return Promise.reject(error);
    }
};

export const login = (email, password) => async (dispatch) => {
    try {
        const response = await AuthenticationService.login(email, password);
        dispatch({
            type: LOGIN_SUCCESS,
            value: response,
        });
        return Promise.resolve(response);
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
        });
        return Promise.reject(error);
    }
};

export const refresh = (token) => async (dispatch) => {
    try {
        const response = await AuthenticationService.refresh(token);
        dispatch({
            type: LOGIN_SUCCESS,
            value: response.data,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
        });
        return Promise.reject(error);
    }
};

export const logout = () => (dispatch) => {
    AuthenticationService.logout();

    dispatch({
        type: LOGOUT,
    });
};
