import { combineReducers } from "redux";
import ingredientsReducer from './slices/ingredients-slice';
import ingredientDetailsReducer from './slices/ingredient-details-slice'
import constructorReducer from './slices/constructor-slice';
import orderReducer from './slices/order-slice';
import userReducer from './slices/user-slice';
import { feedOrderSlice } from "./slices/feed-order-slice";
import { profileOrderSlice } from "./slices/profile-orders-slice";

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  ingredientDetails: ingredientDetailsReducer,
  burgerConstructor: constructorReducer,
  orders: orderReducer,
  user: userReducer,
  feedOrders: feedOrderSlice.reducer,
  profileOrders: profileOrderSlice.reducer, 
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
