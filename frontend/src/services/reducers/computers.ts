import {
    FETCH_COMPUTERS_REQUEST,
    FETCH_COMPUTERS_SUCCESS,
    FETCH_COMPUTERS_FAILURE,
} from "../actions/computers";

const initialState: any = {
    computers: [],
    loading: false,
    error: null,
};

export const selectLoading = (state: any) => state.computers.loading;
export const selectError = (state: any) => state.computers.error;

export const computersReducer = (
    state = initialState,
    action: any
) => {
    switch (action.type) {
        case FETCH_COMPUTERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_COMPUTERS_SUCCESS:
            return {
                ...state,
                computers: action.payload,
                loading: false,
                error: null,
            };
        case FETCH_COMPUTERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};