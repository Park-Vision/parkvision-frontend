import {
    ADD_USER, UPDATE_USER, GET_USER, DELETE_USER,
    AUTHENTICATE_USER, GET_USERS, REGISTER_USER, GET_MANAGERS
} from "./types"
import UserService from "../services/UserService"

export const addUser = (userData) => async (dispatch) => {
    try {
        const response = await UserService.createUser(userData)
        dispatch({
            type: ADD_USER,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getUsers = () => async (dispatch) => {
    try {
        const response = await UserService.getUsers()
        dispatch({
            type: GET_USERS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const getManagers = () => async (dispatch) => {
    try {
        const response = await UserService.getManagers()
        dispatch({
            type: GET_MANAGERS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const getUser = (userId) => async (dispatch) => {
    try {
        const response = await UserService.getUserById(userId)
        dispatch({
            type: GET_USER,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const deleteUser = (userId) => async (dispatch) => {
    try {
        const response = await UserService.deleteUserById(userId)
        dispatch({
            type: DELETE_USER,
            value: userId
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const updateUser = (userData) => async (dispatch) => {
    try {
        const response = await UserService.updateUser(userData)
        dispatch({
            type: UPDATE_USER,
            value: userData
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const authenticateUser = (userData) => async (dispatch) => {
    try {
        const response = await UserService.authenticateUser(userData)
        dispatch({
            type: AUTHENTICATE_USER,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const registerUser = (userData) => async (dispatch) => {
    try {
        const response = await UserService.registerUser(userData)
        dispatch({
            type: REGISTER_USER,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const resetPassword = (email) => async (dispatch) => {
    try {
        const response = await UserService.resetPassword(email)
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const setPasswordFromReset = (userData) => async (dispatch) => {
    try {
        const response = await UserService.setPasswordFromReset(userData)
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const updateName = (userData) => async (dispatch) => {
    try {
        const response = await UserService.updateName(userData)
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const updatePassword = (userData) => async (dispatch) => {
    try {
        const response = await UserService.updatePassword(userData)
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const disableUser = (userId) => async (dispatch) => {
    try {
        const response = await UserService.disableUser(userId)
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const assignParking = (userData) => async (dispatch) => {
    try {
        const response = await UserService.assignParking(userData)
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

