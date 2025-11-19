import { useAppDispatch, useSelector } from "../../../services/store";
import {  useEffect } from "react";
import { TOrder } from "../../../utils/types/order-types";
import { TIngredientProps } from "../../../utils/types/ingredient-types";
 import { WS_URL_PROFILE } from "../../../utils/api";
 import { TOrderFromWs } from "../../../services/slices/ws-slice";
 import styles from './profile-orders.module.css'
 import { OrderCard } from "../../../components/order-card/order-card";
import { profileOrderActions } from "../../../services/slices/profile-orders-slice";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function ProfileOrders() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const allIngredients = useSelector(
    (state) => state.ingredients.items
  ) as TIngredientProps[];

  const { orders = [] } = useSelector(
    (state) => state.profileOrders ?? {}
  );

  useEffect(() => {
    const raw = localStorage.getItem('accessToken');
    if (!raw) return;

    const token = raw.replace('Bearer ', '');
    const wsUrl = `${WS_URL_PROFILE}?token=${token}`;
    dispatch(profileOrderActions.wsConnect(wsUrl));
    return () => {
      dispatch(profileOrderActions.wsDisconnect());
    };
  }, []);

  const ordersWithDetails: TOrder[] = orders.slice().reverse().map((order: TOrderFromWs) => {
    const ingredientsDetailed: TIngredientProps[] = order.ingredients
      .map(id => allIngredients.find(ing => ing._id === id))
      .filter((ing): ing is TIngredientProps => !!ing);

    return {
      number: order.number,
      name: order.name,
      status: order.status as 'created' | 'pending' | 'done',
      createdAt: order.createdAt,
      ingredients: ingredientsDetailed
    };
  });


  const handleOrderClick = (order: TOrder) => {
    navigate(`/profile/orders/${order.number}`, { state: { background: location } });
  };

  return (
    <main className={styles.page}>
      <section className={styles.feedSection}>
        <ul className={styles.feedList}>
          {ordersWithDetails.map(order => (
            <li className={styles.card} key={order.number}>
              <OrderCard
                order={order}
                showStatus={false}
                onClick={() => handleOrderClick(order)}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


