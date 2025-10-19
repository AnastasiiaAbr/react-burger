import { createSlice } from "@reduxjs/toolkit";
import { API } from "../utils/api";
import { request } from "../utils/request";

const initialState = {
  items: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice ({
  name: 'ingredients',
  initialState,
  reducers: {
    getIngredients: (state)  => {
      state.loading = true;
      state.error = null;
    },
    getIngredientsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    getIngredientsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
})

export const {
  getIngredients,
  getIngredientsSuccess,
  getIngredientsFailed
} = ingredientsSlice.actions;

export const fetchIngredients = () => async (dispatch) => {
  dispatch(getIngredients());
  try {
    const data = await request(API.INGREDIENTS);

    dispatch(getIngredientsSuccess(data.data));
  } catch (err) {
    dispatch(getIngredientsFailed(err.message));
  }
};

export const selectIngredient = state => state.ingredients.items;
export const selectIngredientLoading = state => state.ingredients.loading;
export const selectIngredientError = state => state.ingredients.error;


export default ingredientsSlice.reducer;



