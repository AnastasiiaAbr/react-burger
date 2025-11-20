import { createSlice } from "@reduxjs/toolkit";
import { API } from "../../utils/api";
import { request } from "../../utils/request";
import { TIngredientProps } from "../../utils/types/ingredient-types";
import { RootState } from "../root-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

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

type TIngredientResponse = {
  success: boolean;
  data: TIngredientProps[];
}

export const fetchIngredients = createAsyncThunk<
  TIngredientProps[],        
  void,                      
  { rejectValue: string }    
>(
  'ingredients/fetch',
  async (_, thunkAPI) => {
    try {
      const data = await request<TIngredientResponse>(API.INGREDIENTS);
      return data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message); 
    }
  }
);

const ingredientsSlice = createSlice ({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchIngredients.pending, (state)  => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchIngredients.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(fetchIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? null;
    });
  },
});

export const selectIngredient = (state: RootState) : TIngredientProps[] => state.ingredients.items;
export const selectIngredientLoading = (state: RootState) : boolean => state.ingredients.loading;
export const selectIngredientError = (state: RootState) : string | null => state.ingredients.error;


export default ingredientsSlice.reducer;



