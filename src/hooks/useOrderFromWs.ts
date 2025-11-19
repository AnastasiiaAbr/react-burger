import { useParams } from "react-router-dom";
import { TOrderFromWs } from "../services/slices/ws-slice";
import { TIngredientProps } from "../utils/types/ingredient-types";
import { TOrder } from "../utils/types/order-types";

export function useOrderFromWs(
  orders: TOrderFromWs[],
  ingredients: TIngredientProps[],
  orderId?: number
): TOrder | undefined {
  if (!orderId) return undefined;

  const wsOrder = orders.find(o => o.number === orderId);
  if (!wsOrder) return undefined;

  return {
    _id: Number(wsOrder._id),
    number: wsOrder.number,
    name: wsOrder.name,
    status: wsOrder.status,
    createdAt: wsOrder.createdAt,
    ingredients: wsOrder.ingredients
      .map(id => ingredients.find(i => i._id === id))
      .filter(Boolean) as TIngredientProps[],
  };
}

