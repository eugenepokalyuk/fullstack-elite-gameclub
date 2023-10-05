import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { store } from "../store";
import rootReducer from "../reducers/index";

type RootState = ReturnType<typeof rootReducer>;
type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;

export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;