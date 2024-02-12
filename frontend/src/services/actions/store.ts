import { fetchStoreData } from "../../utils/api";
import { useAppDispatch } from "../hooks/hooks";

export const FETCH_STORE_REQUEST: "FETCH_STORE_REQUEST" =
    "FETCH_STORE_REQUEST";
export const FETCH_STORE_SUCCESS: "FETCH_STORE_SUCCESS" =
    "FETCH_STORE_SUCCESS";
export const FETCH_STORE_FAILURE: "FETCH_STORE_FAILURE" =
    "FETCH_STORE_FAILURE";

export type TStore =
    | IFetchStoreRequestAction
    | IFetchStoreSuccessAction
    | IFetchStoreFailureAction;

export interface IFetchStoreRequestAction {
    readonly type: typeof FETCH_STORE_REQUEST;
}

export interface IFetchStoreSuccessAction {
    readonly type: typeof FETCH_STORE_SUCCESS;
    readonly payload: any;
}

export interface IFetchStoreFailureAction {
    readonly type: typeof FETCH_STORE_FAILURE;
    readonly payload: string;
}

export const fetchStoreRequest = (): IFetchStoreRequestAction => ({
    type: FETCH_STORE_REQUEST,
});

enum ActionTypes {
    FETCH_STORE_REQUEST = "FETCH_STORE_REQUEST",
    FETCH_STORE_SUCCESS = "FETCH_STORE_SUCCESS",
    FETCH_STORE_FAILURE = "FETCH_STORE_FAILURE",
    FETCH_CONSTRUCTOR_STORE_REQUEST = "FETCH_CONSTRUCTOR_STORE_REQUEST",
}

export const fetchStoreSuccess = (
    data: any[]
): IFetchStoreSuccessAction => ({
    type: ActionTypes.FETCH_STORE_SUCCESS,
    payload: data,
});

export const fetchStoreFailure = (
    error: string
): IFetchStoreFailureAction => ({
    type: FETCH_STORE_FAILURE,
    payload: error,
});

export function getStore() {
    return function (dispatch: ReturnType<typeof useAppDispatch>) {
        dispatch({
            type: FETCH_STORE_REQUEST,
        });

        fetchStoreData()
            .then((res) => {
                dispatch(fetchStoreSuccess(res.data));
            })
            .catch((error) =>
                dispatch(fetchStoreFailure(error))
            );
    };
}