import {ADD_PARKING, GET_PARKING, GET_PARKINGS, DELETE_PARKING, UPDATE_PARKING} from "./types"
import ParkingService from "../services/ParkingService"

export const addParking = (parkingData) => async (dispatch) => {
    try {
        const response = await ParkingService.createParking(parkingData)
        dispatch({
            type: ADD_PARKING,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getParkings = () => async (dispatch) => {
    try {
        const response = await ParkingService.getParkings()
        dispatch({
            type: GET_PARKINGS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getParking = (parkingId) => async (dispatch) => {
    try {
        const response = await ParkingService.getParkingById(parkingId)
        dispatch({
            type: GET_PARKING,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const deleteParking = (parkingId) => async (dispatch) => {
    try {
        const response = await ParkingService.deleteParkingById(parkingId)
        dispatch({
            type: DELETE_PARKING,
            value: parkingId
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const updateParking = (parkingData) => async (dispatch) => {
    try {
        const response = await ParkingService.updateParking(parkingData)
        dispatch({
            type: UPDATE_PARKING,
            value: parkingData
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
