import {ADD_CAR, DELETE_CAR, UPDATE_CAR, GET_CARS, GET_CAR} from "./types"
import CarService from "../services/CarService"

export const addCar = (carData) => async (dispatch) => {
    try {
        const response = await CarService.addCar(carData)
        dispatch({
            type: ADD_CAR,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getCars = () => async (dispatch) => {
    try {
        const response = await CarService.getCars()
        dispatch({
            type: GET_CARS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getCar = (carId) => async (dispatch) => {
    try {
        const response = await CarService.getCarById(carId)
        dispatch({
            type: GET_CAR,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const deleteCar = (carId) => async (dispatch) => {
    try {
        const response = await CarService.deleteCarById(carId)
        dispatch({
            type: DELETE_CAR,
            value: carId
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const updateCar = (carData) => async (dispatch) => {
    try {
        const response = await CarService.updateCar(carData)
        dispatch({
            type: UPDATE_CAR,
            value: carData
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
