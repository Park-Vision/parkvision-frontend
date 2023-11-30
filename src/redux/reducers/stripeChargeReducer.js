import { ADD_STRIPE_CHARGE, GET_STRIPE_CHARGE, DELETE_STRIPE_CHARGE, GET_STRIPE_CHARGES } from "../actions/types";

const initialState = {
    stripeCharges: [],
    stripeCharge: {}
};

const stripeChargeReducer = (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case ADD_STRIPE_CHARGE:
            return {
                ...state,
                stripeCharges: [...state.stripeCharges, action.value],
                stripeCharge: {}
            };
        case GET_STRIPE_CHARGES:
            return {
                ...state,
                stripeCharges: action.value
            };
        case DELETE_STRIPE_CHARGE:
            return {
                ...state,
                stripeCharges: state.stripeCharges.filter(item => item.id !== parseInt(action.value))
            };
        case GET_STRIPE_CHARGE:
            return {
                ...state,
                stripeCharge: action.value
            };
        default:
            return state;
    }
};

export default stripeChargeReducer;