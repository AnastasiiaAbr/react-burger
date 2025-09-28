import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item: null
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState, 
  reducers: {
    setIngredient:(state, action) => {
      state.item = action.payload;
    },
    clearIngredient: (state) => {
      state.item = null;
    }
  }
});

export const {setIngredient, clearIngredient} = ingredientDetailsSlice.actions;
export const selectIngredientDetails = state => state.ingredientDetails.item;

export default ingredientDetailsSlice.reducer;