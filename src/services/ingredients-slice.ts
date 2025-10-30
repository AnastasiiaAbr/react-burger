import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API } from "../utils/api";
import { request } from "../utils/request";
import { TIngredientProps } from "../utils/types/ingredient-types";
import { RootState } from "./root-reducer";
import { AppDispatch } from "./store";

type TInitialIngredientsState = {
  items: TIngredientProps[];
  loading: boolean;
  error: string | null;
};

const initialState: TInitialIngredientsState = {
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
    getIngredientsSuccess: (state, action: PayloadAction<TIngredientProps[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    getIngredientsFailed: (state, action: PayloadAction<string | null>) => {
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

type TIngredientResponse = {
  success: boolean;
  data: TIngredientProps[];
}

export const fetchIngredients = () => async (dispatch: AppDispatch) => {
  dispatch(getIngredients());
  try {
    const data = await request<TIngredientResponse>(API.INGREDIENTS);

    dispatch(getIngredientsSuccess(data.data));
  } catch (err: any) {
    dispatch(getIngredientsFailed(err.message));
  }
};

export const selectIngredient = (state: RootState) : TIngredientProps[] => state.ingredients.items;
export const selectIngredientLoading = (state: RootState) : boolean => state.ingredients.loading;
export const selectIngredientError = (state: RootState) : string | null => state.ingredients.error;


export default ingredientsSlice.reducer;



