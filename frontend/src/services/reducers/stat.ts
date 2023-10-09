import {
    FETCH_STORE_STAT_REQUEST,
    FETCH_STORE_STAT_SUCCESS,
    FETCH_STORE_STAT_FAILURE,
    FETCH_COMPUTER_STAT_REQUEST,
    FETCH_COMPUTER_STAT_SUCCESS,
    FETCH_COMPUTER_STAT_FAILURE
} from "../actions/stat";

const initialState: any = {
    store: [],
    computers: [],
    loading: false,
    error: null,
};

export const selectLoading = (state: any) => state.computers.loading;
export const selectError = (state: any) => state.computers.error;

export const statReducer = (
    state = initialState,
    action: any
) => {
    switch (action.type) {
        case FETCH_STORE_STAT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_STORE_STAT_SUCCESS:
            return {
                ...state,
                store: action.payload,
                loading: false,
                error: null,
            };
        case FETCH_STORE_STAT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case FETCH_COMPUTER_STAT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_COMPUTER_STAT_SUCCESS:
            return {
                ...state,
                computers: action.payload,
                loading: false,
                error: null,
            };
        case FETCH_COMPUTER_STAT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};