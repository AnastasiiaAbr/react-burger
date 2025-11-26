import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
export type TOrderFromWs = {
  _id: string;
  ingredients: string[];
  status: 'created' | 'done' | 'pending';
  number: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export type TWsMessagePayload = {
  orders: TOrderFromWs[];
  total: number;
  totalToday: number;
};

type TInitialWsState = {
  wsConnected: boolean;
  orders: TOrderFromWs[];
  total: number;
  totalToday: number;
  error?: string | null;
  loading: boolean;
};

export const initialState: TInitialWsState = {
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  loading: false,
};

export const createWsSlice = (sliceName: string) => {
  const wsConnect = createAction<string>(`${sliceName}/connect`);
  const wsDisconnect = createAction(`${sliceName}/disconnect`);
  const onOpen = createAction(`${sliceName}/onOpen`);
  const onClose = createAction(`${sliceName}/onClose`);
  const onMessage = createAction<TWsMessagePayload>(`${sliceName}/onMessage`);
  const onError = createAction<string>(`${sliceName}/onError`);
  const onConnecting = createAction(`${sliceName}/onConnecting`)

  const slice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(onConnecting, (state) => {
          state.loading = true;
        })
        .addCase(onOpen, (state) => {
          state.wsConnected = true;
          state.loading = false;
          state.error = null;
        })
        .addCase(onMessage, (state, action: PayloadAction<TWsMessagePayload>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.loading = false;
        })
        .addCase(onClose, (state) => {
          state.wsConnected = false;
          state.loading = false;
        })
        .addCase(onError, (state, action: PayloadAction<string>) => {
          state.error = action.payload;
          state.loading = false;
        })

    },
  })

  return {
    slice,
    actions: {
      wsConnect,
      wsDisconnect,
      onOpen,
      onClose,
      onMessage,
      onError,
      onConnecting
    },
  }
};
