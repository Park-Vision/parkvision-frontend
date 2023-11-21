import { ADD_DRONE, GET_DRONE, DELETE_DRONE, GET_DRONES, UPDATE_DRONE, COMMAND_DRONE } from "./types"
import DroneService from "../services/DroneService"

export const addDrone = (droneData) => async (dispatch) => {
    try {
        const response = await DroneService.createDrone(droneData)
        dispatch({
            type: ADD_DRONE,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}
export const getDrones = () => async (dispatch) => {
    try {
        const response = await DroneService.getDrones()
        dispatch({
            type: GET_DRONES,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}
export const getDrone = (droneId) => async (dispatch) => {
    try {
        const response = await DroneService.getDroneById(droneId)
        dispatch({
            type: GET_DRONE,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}
export const deleteDrone = (droneId) => async (dispatch) => {
    try {
        const response = await DroneService.deleteDroneById(droneId)
        dispatch({
            type: DELETE_DRONE,
            value: droneId
        })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}
export const updateDrone = (droneData) => async (dispatch) => {
    try {
        const response = await DroneService.updateDrone(droneData)
        dispatch({
            type: UPDATE_DRONE,
            value: droneData
        })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}
export const commandDrone = (droneId, command) => async (dispatch) => {
    try {
        const response = await DroneService.commandDrone(droneId, command)
        dispatch({
            type: COMMAND_DRONE,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}
