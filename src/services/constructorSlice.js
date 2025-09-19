import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bun: null,
  fillings: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = {
        ...action.payload,
        _idAPI: action.payload._id
    }},
    addFilling: (state, action) => {
      state.fillings.push({
        ...action.payload, 
        _id: Date.now().toString(),
      _idAPI: action.payload._id });
    },
    removeFilling: (state, action) => {
      state.fillings = state.fillings.filter(item => item._id !== action.payload);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.fillings = [];
    },
    moveFilling: (state, action) => {
      const {sourceIndex, targetIndex} = action.payload;
      const [removedItem] = state.fillings.splice(sourceIndex, 1);
      state.fillings.splice(targetIndex, 0, removedItem);
    }
  }
});

export const {addFilling, removeFilling, setBun,clearConstructor, moveFilling} = constructorSlice.actions;
export const selectConstructorBun = state => state.burgerConstructor.bun;
export const selectConstructorFillings = state => state.burgerConstructor.fillings;

export default constructorSlice.reducer;