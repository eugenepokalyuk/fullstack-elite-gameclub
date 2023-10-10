import {
    FETCH_STAT_SESSION_REQUEST,
    FETCH_STAT_SESSION_SUCCESS,
    FETCH_STAT_SESSION_FAILURE,
} from "../actions/session";

const initialState: any = {
    stat: [],
    loading: false,
    error: null,
};

export const selectLoading = (state: any) => state.session.loading;
export const selectError = (state: any) => state.session.error;

export const sessionReducer = (
    state = initialState,
    action: any
) => {
    switch (action.type) {
        case FETCH_STAT_SESSION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_STAT_SESSION_SUCCESS:
            return {
                ...state,
                stat: action.payload,
                loading: false,
                error: null,
            };
        case FETCH_STAT_SESSION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};