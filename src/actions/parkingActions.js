import {
    ADD_PARKING,
    GET_PARKING,
    GET_PARKINGS,
    DELETE_PARKING,
    UPDATE_PARKING,
    GET_PARKINGS_NUM_OF_FREE_SPOTS,
    GET_PARKINGS_NUM_OF_SPOTS,
} from "./types";
import ParkingService from "../services/ParkingService";

export const addParking = (parkingData) => async (dispatch) => {
    try {
        const response = await ParkingService.createParking(parkingData);
        dispatch({
            type: ADD_PARKING,
            value: response.data,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getParkings = () => async (dispatch) => {
    try {
        const response = await ParkingService.getParkings();
        dispatch({
            type: GET_PARKINGS,
            value: response.data,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getParking = (parkingId) => async (dispatch) => {
    try {
        const response = await ParkingService.getParkingById(parkingId);
        dispatch({
            type: GET_PARKING,
            value: response.data,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getParkingSpotsNumber = (parkingId) => async (dispatch) => {
    try {
        const response = await ParkingService.getParkingNumOfSpotsById(parkingId);
        dispatch({
            type: GET_PARKINGS_NUM_OF_SPOTS,
            value: response.data,
            parkingId: parkingId,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getParkingFreeSpotsNumber = (parkingId, start) => async (dispatch) => {
    try {
        const response = await ParkingService.getParkingNumOfFreeSpotsById(parkingId, start);
        dispatch({
            type: GET_PARKINGS_NUM_OF_FREE_SPOTS,
            value: response.data,
            parkingId: parkingId,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteParking = (parkingId) => async (dispatch) => {
    try {
        const response = await ParkingService.deleteParkingById(parkingId);
        dispatch({
            type: DELETE_PARKING,
            value: parkingId,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const updateParking = (parkingData) => async (dispatch) => {
    try {
        const response = await ParkingService.updateParking(parkingData);
        dispatch({
            type: UPDATE_PARKING,
            value: parkingData,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};
