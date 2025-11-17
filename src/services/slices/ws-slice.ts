import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
export type TOrderFromWs = {
  _id: string;
  ingredients: string[];
  status: 'created' | 'done' | 'pending';
  number: number;
  createdAt: string;
  updatedAt: string;
  name: string ;
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
};

const initialState: TInitialWsState = {
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
};

export const createWsSlice = (sliceName: string) => {
  const wsConnect = createAction<string>(`${sliceName}/connect`);
  const wsDisconnect = createAction(`${sliceName}/disconnect`);
  const onOpen = createAction(`${sliceName}/onOpen`);
  const onClose = createAction(`${sliceName}/onClose`);
  const onMessage = createAction<TWsMessagePayload>(`${sliceName}/onMessage`);
  const onError = createAction<string>(`${sliceName}/onError`);

  const slice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(wsConnect, (state) => state)
        .addCase(wsDisconnect, (state) => state)
        .addCase(onOpen, (state) => {
          state.wsConnected = true;
          state.error = null;
        })
        .addCase(onClose, (state) => {
          state.wsConnected = false;
        })
        .addCase(onMessage, (state, action: PayloadAction<TWsMessagePayload>) => {
          state.orders = action.payload.orders; // <- тип TOrderFromWs[]
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        })
        .addCase(onError, (state, action: PayloadAction<string>) => {
          state.error = action.payload;
        });
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
    },
  }
};
