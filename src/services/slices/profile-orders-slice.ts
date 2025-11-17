import { createWsSlice } from "./ws-slice";

const profileOrders = createWsSlice('profileOrders');

export const profileOrderSlice = profileOrders.slice;
export const profileOrderActions = profileOrders.actions;
