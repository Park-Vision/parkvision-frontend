import {ADD_DRONE, GET_DRONE, DELETE_DRONE, GET_DRONES, UPDATE_DRONE} from "./types"
import DroneService from "../services/DroneService"

export const addDrone = (droneData) => async (dispatch) => {
    try {
        const response = await DroneService.createDrone(droneData)
        dispatch({
            type: ADD_DRONE,
            payload: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getDrones = () => async (dispatch) => {
    try {
        const response = await DroneService.getDrones()
        dispatch({
            type: GET_DRONES,
            payload: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getDrone = (droneId) => async (dispatch) => {
    try {
        const response = await DroneService.getDroneById(droneId)
        dispatch({
            type: GET_DRONE,
            payload: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const deleteDrone = (droneId) => async (dispatch) => {
    try {
        const response = await DroneService.deleteDroneById(droneId)
        dispatch({
            type: DELETE_DRONE,
            payload: droneId
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const updateDrone = (droneData) => async (dispatch) => {
    try {
        const response = await DroneService.updateDrone(droneData)
        dispatch({
            type: UPDATE_DRONE,
            payload: droneData
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
