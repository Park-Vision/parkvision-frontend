import {
    ADD_PARKING_SPOT,
    DELETE_PARKING_SPOT_SOFT,
    DELETE_PARKING_SPOT_HARD,
    UPDATE_PARKING_SPOT,
    GET_PARKING_SPOTS,
    GET_PARKING_SPOT,
    GET_PARKING_SPOTS_BY_PARKING_ID,
    GET_FREE_PARKING_SPOTS_BY_PARKING_ID
} from "./types"
import ParkingSpotService from "../services/ParkingSpotService"

export const addParkingSpot = (parkingSpotData) => async (dispatch) => {
    try {
        const response = await ParkingSpotService.createParkingSpot(parkingSpotData)
        dispatch({
            type: ADD_PARKING_SPOT,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getParkingSpots = () => async (dispatch) => {
    try {
        const response = await ParkingSpotService.getParkingSpots()
        dispatch({
            type: GET_PARKING_SPOTS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const getParkingSpotsByParkingId = (parkingId) => async (dispatch) => {
    try {
        const response = await ParkingSpotService.getParkingSpotsByParkingId(parkingId)
        dispatch({
            type: GET_PARKING_SPOTS_BY_PARKING_ID,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}

export const getFreeParkingSpotsByParkingId = (parkingId, start, end) => async (dispatch) => {
    try {
        const response = await ParkingSpotService.getFreeParkingSpotsByParkingId(parkingId, start, end);
        dispatch({
            type: GET_FREE_PARKING_SPOTS_BY_PARKING_ID,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getParkingSpot = (parkingSpotId) => async (dispatch) => {
    try {
        const response = await ParkingSpotService.getParkingSpotById(parkingSpotId)
        dispatch({
            type: GET_PARKING_SPOT,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const deleteParkingSpotSoft = (parkingSpotId) => async (dispatch) => {
    try {
        const response = await ParkingSpotService.softDeleteParkingSpotById(parkingSpotId)
        dispatch({
            type: DELETE_PARKING_SPOT_SOFT,
            value: parkingSpotId
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const deleteParkingSpotHard = (parkingSpotId) => async (dispatch) => {
    try {
        const response = await ParkingSpotService.hardDeleteParkingSpotById(parkingSpotId)
        dispatch({
            type: DELETE_PARKING_SPOT_HARD,
            value: parkingSpotId
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const updateParkingSpot = (parkingSpotData) => async (dispatch) => {
    try {
        const response = await ParkingSpotService.updateParkingSpot(parkingSpotData)
        dispatch({
            type: UPDATE_PARKING_SPOT,
            value: parkingSpotData
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
