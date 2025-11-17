import { createWsSlice } from "./ws-slice";

const feedOrders = createWsSlice('feedOrders');

export const feedOrderSlice = feedOrders.slice;
export const feedOrderActions = feedOrders.actions;