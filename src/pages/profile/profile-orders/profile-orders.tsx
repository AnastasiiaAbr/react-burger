import { useAppDispatch, useSelector } from "../../../services/store";
import { useState, useEffect } from "react";
import { RootState } from "../../../services/root-reducer";
import { TOrder } from "../../../utils/types/order-types";
import { TIngredientProps } from "../../../utils/types/ingredient-types";
 import { WS_URL_PROFILE } from "../../../utils/api";
 import { TOrderFromWs } from "../../../services/slices/ws-slice";
 import styles from './profile-orders.module.css'
 import { OrderCard } from "../../../components/order-card/order-card";
 import Modal from "../../../components/modal/modal";
import { profileOrderActions } from "../../../services/slices/profile-orders-slice";
import { OrderModalContent } from "../../../components/wsorder-content/wsorder-content";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function ProfileOrders() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const stateBackground = (location.state as any)?.background;

  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

  const allIngredients = useSelector(
    (state: RootState) => state.ingredients.items
  ) as TIngredientProps[];

    const { orders = [] } = useSelector(
    (state: RootState) => state.profileOrders ?? {}
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
    setSelectedOrder(order);
    navigate(`/profile/orders/${order.number}`, {state: {background: location}});
  };

  const closeModal = () => {
    setSelectedOrder(null);
    navigate(-1);
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

      {selectedOrder && (
        <Modal title='' onClose={closeModal} closeStyle="absolute">
          <OrderModalContent order={selectedOrder} />
        </Modal>
      )}
    </main>
  );
}
