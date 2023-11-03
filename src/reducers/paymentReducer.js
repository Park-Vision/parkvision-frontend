import { ADD_PAYMENT, GET_PAYMENT, DELETE_PAYMENT, GET_PAYMENTS, UPDATE_PAYMENT } from "../actions/types";

const initialState = {
    payments: [],
    payment: {}
};

const paymentReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case ADD_PAYMENT:
            return {
                ...state,
                payments: [...state.payments, action.value],
                payment: {}
            };
        case GET_PAYMENTS:
            return {
                ...state,
                payments: action.value
            };
        case UPDATE_PAYMENT:
            const payment = action.value;
            return {
                ...state,
                payments: state.payments.map(item => (item.id === payment.id ? payment : item)),
                payment: {}
            };
        case DELETE_PAYMENT:
            return {
                ...state,
                payments: state.payments.filter(item => item.id !== parseInt(action.value))
            };
        case GET_PAYMENT:
            return {
                ...state,
                payment: action.value
            };
        default:
            return state;
    }
};

export default paymentReducer;