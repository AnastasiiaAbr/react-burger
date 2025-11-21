import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "./root-reducer";
import {
    useDispatch as useAppDispatchRedux,
    useSelector as useSelectorRedux,
} from "react-redux";
import { feedOrderMiddleware } from "./middlewares/feed-order-middleware";
import { profileOrdersMiddleware } from "./middlewares/profile-orders-middleware";


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedOrderMiddleware, profileOrdersMiddleware),
})

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useAppDispatchRedux<AppDispatch>();
export const useSelector = useSelectorRedux.withTypes<RootState>();