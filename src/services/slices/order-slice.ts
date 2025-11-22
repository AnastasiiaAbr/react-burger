import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../../utils/api";
import { request } from "../../utils/request";
import { RootState } from "../root-reducer";

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

const initialState: TInitialOrderState = {
  currentOrder: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  { number: number },
  string[],
  { rejectValue: string }
>('order/create', async (ingredientsIds, thunkAPI) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) throw new Error('Отсутствует accessToken');

  try {
    const response = await request<TOrderResponse>(API.ORDERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken.startsWith('Bearer') ? accessToken : `Bearer ${accessToken}`
      },
      body: JSON.stringify({ ingredients: ingredientsIds })
    });

    if (response.success) {
      return { number: response.order.number };
    } else {
      return thunkAPI.rejectWithValue('ошибка при создании заказа');
    }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message)
  }
}
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка создания заказа';
        state.currentOrder = null;
      })
  }
}
);


export const { clearOrder } = orderSlice.actions;

export const selectCurrentOrder = (state: RootState): TOrder | null => state.orders.currentOrder;
export const selectOrderLoading = (state: RootState): boolean => state.orders.loading;
export const selectOrderError = (state: RootState): string | null => state.orders.error;

export default orderSlice.reducer;
