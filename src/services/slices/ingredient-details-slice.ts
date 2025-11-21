import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TIngredientProps } from "../../utils/types/ingredient-types";
import { RootState } from "../root-reducer";

type TInitialState = {
  item: TIngredientProps | null;
}
const initialState : TInitialState = {
  item: null
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState, 
  reducers: {
    setIngredient:(state, action: PayloadAction<TIngredientProps>) => {
      state.item = action.payload;
    },
    clearIngredient: (state) => {
      state.item = null;
    }
  }
});

export const {setIngredient, clearIngredient} = ingredientDetailsSlice.actions;
export const selectIngredientDetails = (state: RootState) : TIngredientProps | null => state.ingredientDetails.item;

export default ingredientDetailsSlice.reducer;