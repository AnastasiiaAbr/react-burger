import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import { TIngredientProps } from "../../utils/types/ingredient-types";
import { RootState } from "../root-reducer";

type TIngredientWithId = TIngredientProps & { _uniqueId: string };

type TInitialConstructorState = {
  bun: TIngredientProps | null;
  fillings: TIngredientWithId[];
};

export const initialState: TInitialConstructorState = {
  bun: null,
  fillings: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredientProps>) => {
      state.bun = action.payload
    },
    addFilling: {
      reducer: (state, action: PayloadAction<TIngredientWithId>) => {
        state.fillings.push(action.payload)
      },
      prepare: (ingredient: TIngredientProps) => {
        return { payload: { ...ingredient, _uniqueId: nanoid() } };
      }
    },
    removeFilling: (state, action: PayloadAction<string>) => {
      state.fillings = state.fillings.filter(item => item._uniqueId !== action.payload);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.fillings = [];
    },
    moveFilling: (state, action: PayloadAction<{ sourceIndex: number, targetIndex: number}>) => {
      const { sourceIndex, targetIndex } = action.payload;
      const [removedItem] = state.fillings.splice(sourceIndex, 1);
      state.fillings.splice(targetIndex, 0, removedItem);
    }
  }
});

export const { addFilling, removeFilling, setBun, clearConstructor, moveFilling } = constructorSlice.actions;
export const selectConstructorBun = (state: RootState) : TIngredientProps | null => state.burgerConstructor.bun;
export const selectConstructorFillings = (state: RootState): TIngredientWithId[] => state.burgerConstructor.fillings;

export default constructorSlice.reducer;