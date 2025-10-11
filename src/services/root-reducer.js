import { combineReducers } from "redux";
import ingredientsReducer from './ingredients-slice';
import ingredientDetailsReducer from './ingredient-details-slice'
import constructorReducer from './constructor-slice';
import orderReducer from './order-slice';
import userReducer from './user-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  ingredientDetails: ingredientDetailsReducer,
  burgerConstructor: constructorReducer,
  orders: orderReducer,
  user: userReducer,
})

export default rootReducer;
