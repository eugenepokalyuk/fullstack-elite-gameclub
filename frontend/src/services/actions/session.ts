export const FETCH_STAT_SESSION_REQUEST: "FETCH_STAT_SESSION_REQUEST" =
    "FETCH_STAT_SESSION_REQUEST";
export const FETCH_STAT_SESSION_SUCCESS: "FETCH_STAT_SESSION_SUCCESS" =
    "FETCH_STAT_SESSION_SUCCESS";
export const FETCH_STAT_SESSION_FAILURE: "FETCH_STAT_SESSION_FAILURE" =
    "FETCH_STAT_SESSION_FAILURE";

export type TStoreStat =
    | IFetchStoreStatRequestAction
    | IFetchStoreStatSuccessAction
    | IFetchStoreStatFailureAction;

export interface IFetchStoreStatRequestAction {
    readonly type: typeof FETCH_STAT_SESSION_REQUEST;
}

export interface IFetchStoreStatSuccessAction {
    readonly type: typeof FETCH_STAT_SESSION_SUCCESS;
    readonly payload: any;
}

export interface IFetchStoreStatFailureAction {
    readonly type: typeof FETCH_STAT_SESSION_FAILURE;
    readonly payload: string;
}

export const fetchStoreStatRequest = (): IFetchStoreStatRequestAction => ({
    type: FETCH_STAT_SESSION_REQUEST,
});

enum ActionTypes {
    FETCH_STAT_SESSION_REQUEST = "FETCH_STAT_SESSION_REQUEST",
    FETCH_STAT_SESSION_SUCCESS = "FETCH_STAT_SESSION_SUCCESS",
    FETCH_STAT_SESSION_FAILURE = "FETCH_STAT_SESSION_FAILURE",
}

export const fetchStoreStatSuccess = (
    data: any[]
): IFetchStoreStatSuccessAction => ({
    type: ActionTypes.FETCH_STAT_SESSION_SUCCESS,
    payload: data,
});

export const fetchStoreStatFailure = (
    error: string
): IFetchStoreStatFailureAction => ({
    type: FETCH_STAT_SESSION_FAILURE,
    payload: error,
});