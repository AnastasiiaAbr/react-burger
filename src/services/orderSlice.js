import { createSlice } from "@reduxjs/toolkit";
import { API } from "../utils/api";
import { request } from "../utils/checkResponse";

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
    const data = await request(API.ORDERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredientsIds })
    });

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
