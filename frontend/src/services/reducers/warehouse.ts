import {
    SELECT_WAREHOUSE_REQUEST,
    SELECT_WAREHOUSE_SUCCESS,
    SELECT_WAREHOUSE_FAILURE,
    ActionTypes
} from "../actions/warehouse";

const initialState: any = {
    item: [],
    loading: false,
    error: null,
};

export const selectLoading = (state: any) => state.computers.loading;
export const selectError = (state: any) => state.computers.error;

export const warehouseReducer = (
    state = initialState,
    action: any
) => {
    switch (action.type) {
        case SELECT_WAREHOUSE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case SELECT_WAREHOUSE_SUCCESS:
            return {
                ...state,
                item: action.payload,
                loading: false,
                error: null,
            };
        case SELECT_WAREHOUSE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};