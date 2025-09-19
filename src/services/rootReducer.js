import { combineReducers } from "redux";
import ingredientsReducer from './ingredientsSlice';
import ingredientDetailsReducer from './ingredientDetailsSlice'
import constructorReducer from './constructorSlice';
import orderReducer from './orderSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  ingredientDetails: ingredientDetailsReducer,
  burgerConstructor: constructorReducer,
  orders: orderReducer,
})

export default rootReducer;
