export const SWITCH_PAYMENT_REQUEST: "SWITCH_PAYMENT_REQUEST" =
    "SWITCH_PAYMENT_REQUEST";

export type TComputers =
    | ISwitchPaymentRequestAction;

export interface ISwitchPaymentRequestAction {
    readonly type: typeof SWITCH_PAYMENT_REQUEST;
    readonly payload: string;
}

enum ActionTypes {
    SWITCH_PAYMENT_REQUEST = "SWITCH_PAYMENT_REQUEST",
}

export const switchPaymentRequest = (
    data: string
): ISwitchPaymentRequestAction => ({
    type: ActionTypes.SWITCH_PAYMENT_REQUEST,
    payload: data,
});