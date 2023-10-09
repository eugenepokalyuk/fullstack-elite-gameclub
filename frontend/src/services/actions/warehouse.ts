export const SELECT_WAREHOUSE_REQUEST: "SELECT_WAREHOUSE_REQUEST" =
    "SELECT_WAREHOUSE_REQUEST";
export const SELECT_WAREHOUSE_SUCCESS: "SELECT_WAREHOUSE_SUCCESS" =
    "SELECT_WAREHOUSE_SUCCESS";
export const SELECT_WAREHOUSE_FAILURE: "SELECT_WAREHOUSE_FAILURE" =
    "SELECT_WAREHOUSE_FAILURE";

export type TWarehouse =
    | ISelectWarehouseRequestAction
    | ISelectWarehouseSuccessAction
    | ISelectWarehouseFailureAction;

export interface ISelectWarehouseRequestAction {
    readonly type: typeof SELECT_WAREHOUSE_REQUEST;
}

export interface ISelectWarehouseSuccessAction {
    readonly type: typeof SELECT_WAREHOUSE_SUCCESS;
    readonly payload: any;
}

export interface ISelectWarehouseFailureAction {
    readonly type: typeof SELECT_WAREHOUSE_FAILURE;
    readonly payload: string;
}

export const fetchWarehouseRequest = (): ISelectWarehouseRequestAction => ({
    type: SELECT_WAREHOUSE_REQUEST,
});

enum ActionTypes {
    SELECT_WAREHOUSE_REQUEST = "SELECT_WAREHOUSE_REQUEST",
    SELECT_WAREHOUSE_SUCCESS = "SELECT_WAREHOUSE_SUCCESS",
    SELECT_WAREHOUSE_FAILURE = "SELECT_WAREHOUSE_FAILURE",
    FETCH_CONSTRUCTOR_WAREHOUSE_REQUEST = "FETCH_CONSTRUCTOR_WAREHOUSE_REQUEST",
}

export const fetchWarehouseSuccess = (
    data: any[]
): ISelectWarehouseSuccessAction => ({
    type: ActionTypes.SELECT_WAREHOUSE_SUCCESS,
    payload: data,
});

export const fetchWarehouseFailure = (
    error: string
): ISelectWarehouseFailureAction => ({
    type: SELECT_WAREHOUSE_FAILURE,
    payload: error,
});
// export function getWarehouse() {
//     return function (dispatch: ReturnType<typeof useAppDispatch>) {
//         dispatch({
//             type: SELECT_WAREHOUSE_REQUEST,
//         });

//         fetchWarehouseData()
//             .then((res) => {
//                 dispatch(fetchWarehouseSuccess(res.data));
//             })
//             .catch((error) =>
//                 dispatch(fetchWarehouseFailure(error))
//             );
//     };
// }