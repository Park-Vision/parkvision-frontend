import {ADD_RESERVATION, DELETE_RESERVATION, GET_RESERVATION,
    UPDATE_RESERVATION, GET_RESERVATIONS, GET_USER_RESERVATIONS} from "./types"
import ReservationService from "../services/ReservationService"

export const addReservation = (reservationData) => async (dispatch) => {
    try {
        const response = await ReservationService.createReservation(reservationData)
        dispatch({
            type: ADD_RESERVATION,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getReservations = () => async (dispatch) => {
    try {
        const response = await ReservationService.getReservations()
        dispatch({
            type: GET_RESERVATIONS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getUserReservations = () => async (dispatch) => {
    try {
        const response = await ReservationService.getUserReservations()
        dispatch({
            type: GET_USER_RESERVATIONS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getReservation = (reservationId) => async (dispatch) => {
    try {
        const response = await ReservationService.getReservationById(reservationId)
        dispatch({
            type: GET_RESERVATION,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const deleteReservation = (reservationId) => async (dispatch) => {
    try {
        const response = await ReservationService.deleteReservationById(reservationId)
        dispatch({
            type: DELETE_RESERVATION,
            value: reservationId
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const updateReservation = (reservationData) => async (dispatch) => {
    try {
        const response = await ReservationService.updateReservation(reservationData)
        dispatch({
            type: UPDATE_RESERVATION,
            value: reservationData
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
