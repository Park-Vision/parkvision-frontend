import {
    ADD_DRONE_MISSION,
    GET_DRONE_MISSION,
    DELETE_DRONE_MISSION,
    GET_DRONE_MISSIONS,
    UPDATE_DRONE_MISSION,
} from "./types";
import DroneMissionService from "../services/DroneMissionService";

export const addDroneMission = (droneMissionData) => async (dispatch) => {
    try {
        const response = await DroneMissionService.createDroneMission(
            droneMissionData
        );
        dispatch({
            type: ADD_DRONE_MISSION,
            value: response.data,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getDroneMissions = () => async (dispatch) => {
    try {
        const response = await DroneMissionService.getDroneMissions();
        dispatch({
            type: GET_DRONE_MISSIONS,
            value: response.data,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getDroneMission = (droneMissionId) => async (dispatch) => {
    try {
        const response = await DroneMissionService.getDroneMissionById(
            droneMissionId
        );
        dispatch({
            type: GET_DRONE_MISSION,
            value: response.data,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteDroneMission = (droneMissionId) => async (dispatch) => {
    try {
        const response = await DroneMissionService.deleteDroneMissionById(
            droneMissionId
        );
        dispatch({
            type: DELETE_DRONE_MISSION,
            value: droneMissionId,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateDroneMission = (droneMissionData) => async (dispatch) => {
    try {
        const response = await DroneMissionService.updateDroneMission(
            droneMissionData
        );
        dispatch({
            type: UPDATE_DRONE_MISSION,
            value: droneMissionData,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};