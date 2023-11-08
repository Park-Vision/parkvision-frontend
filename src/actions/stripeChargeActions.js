import { ADD_STRIPE_CHARGE, GET_STRIPE_CHARGE, DELETE_STRIPE_CHARGE, GET_STRIPE_CHARGES } from "./types";
import StripeChargeService from "../services/StripeChargeService";

export const addStripeCharge = (stripeChargeData) => async (dispatch) => {
    try {
        const response = await StripeChargeService.addStripeCharge(stripeChargeData);
        dispatch({
            type: ADD_STRIPE_CHARGE,
            value: response.data
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getStripeCharges = () => async (dispatch) => {
    try {
        const response = await StripeChargeService.getStripeCharges();
        dispatch({
            type: GET_STRIPE_CHARGES,
            value: response.data
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getStripeCharge = (chargeId) => async (dispatch) => {
    try {
        const response = await StripeChargeService.getStripeChargeById(chargeId);
        dispatch({
            type: GET_STRIPE_CHARGE,
            value: response.data
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteStripeCharge = (chargeId) => async (dispatch) => {
    try {
        const response = await StripeChargeService.deleteStripeChargeById(chargeId);
        dispatch({
            type: DELETE_STRIPE_CHARGE,
            value: chargeId
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};
