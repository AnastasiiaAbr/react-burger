import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './feed.module.css';
import { OrderCard } from '../../components/order-card/order-card';
import { useAppDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/root-reducer';
import { TIngredientProps } from '../../utils/types/ingredient-types';
import { TOrder } from '../../utils/types/order-types';
import { TOrderFromWs } from '../../services/slices/ws-slice';
import Modal from '../../components/modal/modal';
import { WS_URL_ALL } from '../../utils/api';
import { feedOrderActions } from '../../services/slices/feed-order-slice';
import { OrderModalContent } from '../../components/wsorder-content/wsorder-content';


export function FeedPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const stateBackground = (location.state as any)?.background;

  const { orders = [], total = 0, totalToday = 0 } = useSelector(
    (state: RootState) => state.feedOrders ?? {}
  );

  const allIngredients = useSelector(
    (state: RootState) => state.ingredients.items
  ) as TIngredientProps[];

  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    dispatch(feedOrderActions.wsConnect(WS_URL_ALL));
    return () => {
      dispatch(feedOrderActions.wsDisconnect());
    };
  }, [dispatch]);

  const ordersWithDetails: TOrder[] = orders.map((order: TOrderFromWs) => {
    const ingredientsDetailed: TIngredientProps[] = order.ingredients
      .map(id => allIngredients.find(ing => ing._id === id))
      .filter((ing): ing is TIngredientProps => !!ing);

    return {
      number: order.number,
      name: order.name || 'Без названия',
      status: order.status as 'created' | 'pending' | 'done',
      createdAt: order.createdAt,
      ingredients: ingredientsDetailed,
    };
  });

  const handleOrderClick = (order: TOrder) => {
    navigate(`/feed/${order.number}`, { state: { background: location }
     });
  };

  const closeModal = () => {
    setSelectedOrder(null);
    navigate(-1);

  };

  const doneOrders = ordersWithDetails.filter(order => order.status === 'done');
  const pendingOrders = ordersWithDetails.filter(order => order.status === 'pending');

  const feedContent = (
    <main className={styles.page}>
      <section className={styles.feedSection}>
        <h1 className={styles.title}>Лента заказов</h1>
        <ul className={styles.feedList}>
          {ordersWithDetails.map(order => (
            <li key={order.number} className={styles.card}>
              <OrderCard
                order={order}
                showStatus={false}
                onClick={() => handleOrderClick(order)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.statistics}>
        <div className={styles.statuses}>
          <div className={styles.column}>
            <h2>Готовы</h2>
            <ul className={styles.doneStatus}>
              {doneOrders.slice(0, 6).map(order => (
                <li
                  key={order.number}
                  className={`${styles.numberDone} text text_type_digits-medium`}
                >
                  {order.number}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.column}>
            <h2>В работе:</h2>
            <ul className={styles.pendingStatus}>
              {pendingOrders.slice(0, 6).map(order => (
                <li
                  key={order.number}
                  className={`${styles.number} text text_type_digits-medium`}
                >
                  {order.number}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.total}>
          <h2>Выполнено за все время:</h2>
          <span className={`${styles.totalNumber} text text_type_digits-large`}>
            {total}
          </span>
          <h2>Выполнено за сегодня:</h2>
          <span className={`${styles.totalNumberToday} text text_type_digits-large`}>
            {totalToday}
          </span>
        </div>
      </section>
    </main>
  );

  return (
    <>
      {!selectedOrder || stateBackground ? feedContent : null}

      {selectedOrder && (
        <Modal title="" onClose={closeModal} closeStyle="absolute">
          <OrderModalContent order={selectedOrder} />
        </Modal>
      )}
    </>
  );
}

