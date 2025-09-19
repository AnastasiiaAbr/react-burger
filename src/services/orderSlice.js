import { createSlice } from "@reduxjs/toolkit";
import { API_ORDER } from "../utils/api";

const initialState = {
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
    fetchOrderSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    },
    fetchOrderFailed: (state, action) => {
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

export const createOrder = (ingredientsIds) => async (dispatch) => {
  dispatch(fetchOrderStart());
  try {
    const res = await fetch(API_ORDER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredientsIds })
    });

    if (!res.ok) throw new Error(`Ошибка ${res.status}`);

    const data = await res.json();

    if (data.success) {
      dispatch(fetchOrderSuccess({number: data.order.number}));
    } else {
      dispatch(fetchOrderFailed('Ошибка при создании заказа'));
    }
  } catch (err) {
    dispatch(fetchOrderFailed(err.message));
  }
};

export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;

export default orderSlice.reducer;
