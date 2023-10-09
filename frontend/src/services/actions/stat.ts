export const FETCH_STORE_STAT_REQUEST: "FETCH_STORE_STAT_REQUEST" =
    "FETCH_STORE_STAT_REQUEST";
export const FETCH_STORE_STAT_SUCCESS: "FETCH_STORE_STAT_SUCCESS" =
    "FETCH_STORE_STAT_SUCCESS";
export const FETCH_STORE_STAT_FAILURE: "FETCH_STORE_STAT_FAILURE" =
    "FETCH_STORE_STAT_FAILURE";
export const FETCH_COMPUTER_STAT_REQUEST: "FETCH_COMPUTER_STAT_REQUEST" =
    "FETCH_COMPUTER_STAT_REQUEST";
export const FETCH_COMPUTER_STAT_SUCCESS: "FETCH_COMPUTER_STAT_SUCCESS" =
    "FETCH_COMPUTER_STAT_SUCCESS";
export const FETCH_COMPUTER_STAT_FAILURE: "FETCH_COMPUTER_STAT_FAILURE" =
    "FETCH_COMPUTER_STAT_FAILURE";

export type TStoreStat =
    | IFetchStoreStatRequestAction
    | IFetchStoreStatSuccessAction
    | IFetchStoreStatFailureAction;

export type TCopmuterStat =
    | IFetchCopmuterStatRequestAction
    | IFetchCopmuterStatSuccessAction
    | IFetchCopmuterStatFailureAction;

export interface IFetchStoreStatRequestAction {
    readonly type: typeof FETCH_STORE_STAT_REQUEST;
}

export interface IFetchStoreStatSuccessAction {
    readonly type: typeof FETCH_STORE_STAT_SUCCESS;
    readonly payload: any;
}

export interface IFetchStoreStatFailureAction {
    readonly type: typeof FETCH_STORE_STAT_FAILURE;
    readonly payload: string;
}

export interface IFetchCopmuterStatRequestAction {
    readonly type: typeof FETCH_COMPUTER_STAT_REQUEST;
}

export interface IFetchCopmuterStatSuccessAction {
    readonly type: typeof FETCH_COMPUTER_STAT_SUCCESS;
    readonly payload: any;
}

export interface IFetchCopmuterStatFailureAction {
    readonly type: typeof FETCH_COMPUTER_STAT_FAILURE;
    readonly payload: string;
}

export const fetchStoreStatRequest = (): IFetchStoreStatRequestAction => ({
    type: FETCH_STORE_STAT_REQUEST,
});

export const fetchCopmuterStatRequest = (): IFetchCopmuterStatRequestAction => ({
    type: FETCH_COMPUTER_STAT_REQUEST,
});

enum ActionTypes {
    FETCH_STORE_STAT_REQUEST = "FETCH_STORE_STAT_REQUEST",
    FETCH_STORE_STAT_SUCCESS = "FETCH_STORE_STAT_SUCCESS",
    FETCH_STORE_STAT_FAILURE = "FETCH_STORE_STAT_FAILURE",
    
    FETCH_COMPUTER_STAT_REQUEST = "FETCH_COMPUTER_STAT_REQUEST",
    FETCH_COMPUTER_STAT_SUCCESS = "FETCH_COMPUTER_STAT_SUCCESS",
    FETCH_COMPUTER_STAT_FAILURE = "FETCH_COMPUTER_STAT_FAILURE",
}

export const fetchStoreStatSuccess = (
    data: any[]
): IFetchStoreStatSuccessAction => ({
    type: ActionTypes.FETCH_STORE_STAT_SUCCESS,
    payload: data,
});

export const fetchStoreStatFailure = (
    error: string
): IFetchStoreStatFailureAction => ({
    type: FETCH_STORE_STAT_FAILURE,
    payload: error,
});

export const fetchCopmuterStatSuccess = (
    data: any[]
): IFetchCopmuterStatSuccessAction => ({
    type: ActionTypes.FETCH_COMPUTER_STAT_SUCCESS,
    payload: data,
});

export const fetchCopmuterStatFailure = (
    error: string
): IFetchCopmuterStatFailureAction => ({
    type: FETCH_COMPUTER_STAT_FAILURE,
    payload: error,
});