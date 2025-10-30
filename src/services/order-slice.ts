import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API } from "../utils/api";
import { request } from "../utils/request";
import { TIngredientProps } from "../utils/types/ingredient-types";
import { AppDispatch } from "./store";
import { RootState } from "./root-reducer";

type TOrder = {
  number: number;
};

type TOrderResponse = {
  success: boolean;
  name: string;
  order: TOrder;
}

type TInitialOrderState = {
  currentOrder: null | TOrder;
  loading: boolean;
  error: string | null;
};

const initialState : TInitialOrderState = {
  currentOrder: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrderStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentOrder = null;
    },
    fetchOrderSuccess: (state, action: PayloadAction<TOrder | null>) => {
      state.loading = false;
      state.currentOrder = action.payload;
    },
    fetchOrderFailed: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
      state.currentOrder = null;
    },
    clearOrder: (state) => {
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
    }
  }
});


export const { fetchOrderStart, fetchOrderSuccess, fetchOrderFailed, clearOrder } = orderSlice.actions;

export const createOrder = (ingredientsIds: string[]) => async (dispatch: AppDispatch) => {
  dispatch(fetchOrderStart());
  try {
    const response = await request<TOrderResponse>(API.ORDERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredientsIds })
    });

    if (response.success) {
      dispatch(fetchOrderSuccess({number: response.order.number}));
    } else {
      dispatch(fetchOrderFailed('Ошибка при создании заказа'));
    }
  } catch (err: any) {
    dispatch(fetchOrderFailed(err.message));
  }
};

export const selectCurrentOrder = (state: RootState) : TOrder | null => state.orders.currentOrder;
export const selectOrderLoading = (state:RootState): boolean => state.orders.loading;
export const selectOrderError = (state: RootState): string | null => state.orders.error;

export default orderSlice.reducer;
