import { fetchComputersData } from "../../utils/api";
import { useAppDispatch } from "../hooks/hooks";

export const FETCH_COMPUTERS_REQUEST: "FETCH_COMPUTERS_REQUEST" =
    "FETCH_COMPUTERS_REQUEST";
export const FETCH_COMPUTERS_SUCCESS: "FETCH_COMPUTERS_SUCCESS" =
    "FETCH_COMPUTERS_SUCCESS";
export const FETCH_COMPUTERS_FAILURE: "FETCH_COMPUTERS_FAILURE" =
    "FETCH_COMPUTERS_FAILURE";

export type TComputers =
    | IFetchComputersRequestAction
    | IFetchComputersSuccessAction
    | IFetchComputersFailureAction;

export interface IFetchComputersRequestAction {
    readonly type: typeof FETCH_COMPUTERS_REQUEST;
}

export interface IFetchComputersSuccessAction {
    readonly type: typeof FETCH_COMPUTERS_SUCCESS;
    readonly payload: any;
}

export interface IFetchComputersFailureAction {
    readonly type: typeof FETCH_COMPUTERS_FAILURE;
    readonly payload: string;
}

export const fetchComputersRequest = (): IFetchComputersRequestAction => ({
    type: FETCH_COMPUTERS_REQUEST,
});

enum ActionTypes {
    FETCH_COMPUTERS_REQUEST = "FETCH_COMPUTERS_REQUEST",
    FETCH_COMPUTERS_SUCCESS = "FETCH_COMPUTERS_SUCCESS",
    FETCH_COMPUTERS_FAILURE = "FETCH_COMPUTERS_FAILURE",
    FETCH_COMPUTERS_CLEAR = "FETCH_COMPUTERS_CLEAR",
    FETCH_CONSTRUCTOR_COMPUTERS_REQUEST = "FETCH_CONSTRUCTOR_COMPUTERS_REQUEST",
}

export const fetchComputersSuccess = (
    data: any[]
): IFetchComputersSuccessAction => ({
    type: ActionTypes.FETCH_COMPUTERS_SUCCESS,
    payload: data,
});

export const fetchComputersFailure = (
    error: string
): IFetchComputersFailureAction => ({
    type: FETCH_COMPUTERS_FAILURE,
    payload: error,
});

export function getComputers() {
    return function (dispatch: ReturnType<typeof useAppDispatch>) {
        dispatch({
            type: FETCH_COMPUTERS_REQUEST,
        });

        fetchComputersData()
            .then((res) => {
                dispatch(fetchComputersSuccess(res.data));
            })
            .catch((error) =>
                dispatch(fetchComputersFailure(error))
            );
    };
}