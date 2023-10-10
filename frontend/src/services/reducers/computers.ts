import {
    FETCH_COMPUTERS_REQUEST,
    FETCH_COMPUTERS_SUCCESS,
    FETCH_COMPUTERS_FAILURE,
    // UPDATE_PC_SESSION
} from "../actions/computers";

const initialState: any = {
    computers: [],
    playingComputers: [],
    loading: false,
    error: null,
};

export const selectLoading = (state: any) => state.computers.loading;
export const selectError = (state: any) => state.computers.error;

// export const updatePcSession = (id: string, pc_session: string) => ({
//     type: UPDATE_PC_SESSION,
//     payload: {
//         id,
//         pc_session,
//     },
// });

export const computersReducer = (
    state = initialState,
    action: any
) => {
    switch (action.type) {
        case FETCH_COMPUTERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_COMPUTERS_SUCCESS:
            return {
                ...state,
                computers: action.payload,
                loading: false,
                error: null,
            };
        case FETCH_COMPUTERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        // case UPDATE_PC_SESSION:
        //     const { id, pc_session } = action.payload;
        //     let updatedComputers = [...state.computers];
        //     updatedComputers.find(el => el.id == id).pc_session = pc_session
        //     return {
        //         ...state,
        //         playingComputers: updatedComputers,
        //     };
        default:
            return state;
    }
};