import { ADD_PAYMENT, GET_PAYMENT, DELETE_PAYMENT, GET_PAYMENTS, UPDATE_PAYMENT } from "./types";
import PaymentService from "../services/PaymentService";

export const addPayment = (paymentData) => async (dispatch) => {
    try {
        const response = await PaymentService.addPayment(paymentData);
        dispatch({
            type: ADD_PAYMENT,
            value: response.data
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPayments = () => async (dispatch) => {
    try {
        const response = await PaymentService.getPayments();
        dispatch({
            type: GET_PAYMENTS,
            value: response.data
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPayment = (paymentId) => async (dispatch) => {
    try {
        const response = await PaymentService.getPaymentById(paymentId);
        dispatch({
            type: GET_PAYMENT,
            value: response.data
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deletePayment = (paymentId) => async (dispatch) => {
    try {
        const response = await PaymentService.deletePaymentById(paymentId);
        dispatch({
            type: DELETE_PAYMENT,
            value: paymentId
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updatePayment = (paymentData) => async (dispatch) => {
    try {
        const response = await PaymentService.updatePayment(paymentData);
        dispatch({
            type: UPDATE_PAYMENT,
            value: paymentData
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};