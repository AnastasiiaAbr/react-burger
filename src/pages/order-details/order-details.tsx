import React, { useEffect, useState } from "react";
import { OrderModalContent } from "../../components/wsorder-content/wsorder-content";
import { useParams } from "react-router-dom";
import { TIngredientProps } from "../../utils/types/ingredient-types";
import { TOrder } from "../../utils/types/order-types";
import { getOrderByNumber } from "../../utils/request";
import styles from './order-details.module.css';
import { TOrderFromWs } from "../../services/slices/ws-slice";

type TOrderDetails = {
  wsOrders: TOrderFromWs[];
  allIngredients: TIngredientProps[];
}

export function OrderDetailPage({ wsOrders = [], allIngredients }: TOrderDetails): React.JSX.Element | null {
  const { id } = useParams();
  const [order, setOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    if (!id) return;

    const wsOrder = wsOrders.find(o => o.number === Number(id))

    if (wsOrder) {
      const detailed = wsOrder.ingredients
        .map((i: string) => allIngredients.find(item => item._id === i))
        .filter(Boolean) as TIngredientProps[];

      setOrder({
        number: wsOrder.number,
        name: wsOrder.name,
        status: wsOrder.status,
        createdAt: wsOrder.createdAt,
        ingredients: detailed
      });
      return;
    }

    getOrderByNumber(id).then(data => {
      const apiOrder = data.orders[0];
      if (!apiOrder) return;

      const detailed = apiOrder.ingredients
        .map((i: string) => allIngredients.find(item => item._id === i))
        .filter(Boolean) as TIngredientProps[];

      setOrder({
        number: apiOrder.number,
        name: apiOrder.name,
        status: apiOrder.status,
        createdAt: apiOrder.createdAt,
        ingredients: detailed
      });
    });
  }, [id, wsOrders, allIngredients]);

  if (!order) return null;

  return (
    <div className={styles.fullscreen}>
      <OrderModalContent order={order} />
    </div>
  );
}