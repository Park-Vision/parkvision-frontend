import {ADD_POINT, GET_POINT, DELETE_POINT, GET_POINTS, UPDATE_POINT} from "./types"
import PointService from "../services/PointService"

export const addPoint = (pointData) => async (dispatch) => {
    try {
        const response = await PointService.createPoint(pointData)
        dispatch({
            type: ADD_POINT,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getPoints = () => async (dispatch) => {
    try {
        const response = await PointService.getPoints()
        dispatch({
            type: GET_POINTS,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const getPoint = (pointId) => async (dispatch) => {
    try {
        const response = await PointService.getPointById(pointId)
        dispatch({
            type: GET_POINT,
            value: response.data
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const deletePoint = (pointId) => async (dispatch) => {
    try {
        const response = await PointService.deletePointById(pointId)
        dispatch({
            type: DELETE_POINT,
            value: pointId
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
export const updatePoint = (pointData) => async (dispatch) => {
    try {
        const response = await PointService.updatePoint(pointData)
        dispatch({
            type: UPDATE_POINT,
            value: pointData
        })
        return Promise.resolve(response.data)
    } catch (error){
        return Promise.reject(error)
    }
}
