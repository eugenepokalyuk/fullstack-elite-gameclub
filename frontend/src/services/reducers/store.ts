import {
    FETCH_STORE_REQUEST,
    FETCH_STORE_SUCCESS,
    FETCH_STORE_FAILURE,
} from "../actions/store";

const initialState: any = {
    items: [],
    loading: false,
    error: null,
};

export const selectLoading = (state: any) => state.computers.loading;
export const selectError = (state: any) => state.computers.error;

export const storeReducer = (
    state = initialState,
    action: any
) => {
    switch (action.type) {
        case FETCH_STORE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_STORE_SUCCESS:
            return {
                ...state,
                items: action.payload,
                loading: false,
                error: null,
            };
        case FETCH_STORE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};