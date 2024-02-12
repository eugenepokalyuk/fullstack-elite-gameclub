import {
    SWITCH_PAYMENT_REQUEST,
} from "../actions/payment";

const initialState: any = {
    paymentType: "",
    loading: false,
    error: null,
};

export const selectLoading = (state: any) => state.computers.loading;
export const selectError = (state: any) => state.computers.error;

export const paymentReducer = (
    state = initialState,
    action: any
) => {
    switch (action.type) {
        case SWITCH_PAYMENT_REQUEST:
            return {
                ...state,
                paymentType: action.payload,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};