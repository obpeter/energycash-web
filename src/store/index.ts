import {AppDispatch, State} from "./store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export * from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;