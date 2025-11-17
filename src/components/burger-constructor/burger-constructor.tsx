import React, { useRef, useMemo, useEffect } from 'react';
import { Button, ConstructorElement, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';
import { useModal } from '../../hooks/useModal';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { useAppDispatch, useSelector } from '../../services/store';
import {
  selectConstructorBun,
  selectConstructorFillings,
  removeFilling,
  setBun,
  addFilling,
  moveFilling,
  clearConstructor
} from '../../services/slices/constructor-slice';
import {
  createOrder,
  selectCurrentOrder,
  selectOrderLoading
} from '../../services/slices/order-slice';
import Preloader from '../preloader/preloader';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/user-slice';
import { TIngredientProps } from '../../utils/types/ingredient-types';

type TFiilingCardProps = {
  ingredient: TIngredientProps;
  index: number;
  moveCard: (sourceIndex: number, targetIndex: number) => void;
  onRemove: (id: string) => void;
};

interface IDragItem {
  index: number;
  ingredient: TIngredientProps;
  type: string;
}

function FillingCard({ ingredient, index, moveCard, onRemove }: TFiilingCardProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<IDragItem>({
    accept: 'filling',
    hover(item, monitor: DropTargetMonitor<IDragItem>) {
      if (!ref.current) return;

      const sourceIndex = item.index;
      const targetIndex = index;
      if (sourceIndex === targetIndex) return;

      const targetRect = ref.current.getBoundingClientRect();
      const targetMiddleY = (targetRect.bottom - targetRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - targetRect.top;
      if (sourceIndex < targetIndex && hoverClientY < targetMiddleY) return;
      if (sourceIndex > targetIndex && hoverClientY > targetMiddleY) return;
      moveCard(sourceIndex, targetIndex);
      item.index = targetIndex;
    }
  });

  const [, drag] = useDrag<IDragItem>({
    type: 'filling',
    item: { ingredient, index, type: 'filling' }
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={styles.ingredient}>
      <DragIcon type='primary' />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => {
          if (ingredient._uniqueId) {
            onRemove(ingredient._uniqueId);
          }
        }}
      />
    </div>
  );
}

export default function BurgerConstructor(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isModalOpen, openModal, closeModal } = useModal();

  const containerRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<TIngredientProps, void, { isOver: boolean }>({
    accept: 'ingredient',
    drop: (item) => {
      if (item.type === 'bun') {
        dispatch(setBun(item));
      } else {
        dispatch(addFilling(item));
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() })
  });

  drop(containerRef);

  const user = useSelector(selectUser);
  const bun = useSelector(selectConstructorBun);
  const fillings = useSelector(selectConstructorFillings);
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrderLoading);

  const totalPrice = useMemo<number>(() => {
    return (bun ? bun.price * 2 : 0) + fillings.reduce((sum: number, item: TIngredientProps) => sum + item.price, 0);
  }, [bun, fillings]);

  useEffect(() => {
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder && user && !bun && fillings.length === 0) {
      const { bun: savedBun, fillings: savedFillings } = JSON.parse(savedOrder);
      if (savedBun) dispatch(setBun(savedBun));
      if (savedFillings?.length) savedFillings.forEach((f: TIngredientProps) => dispatch(addFilling(f)));
      localStorage.removeItem('pendingOrder');
    }
  }, [user, dispatch, bun, fillings.length]);

  useEffect(() => {
    if (order && !loading) {
      dispatch(clearConstructor());
    }
  }, [order, loading, dispatch]);

  const handleOrderClick = (): void => {
    if (!bun) {
      alert('Выберите булку для оформления заказа');
      return;
    }
    if (fillings.length === 0) {
      alert('Добавьте хотя бы один ингредиент');
      return;
    }

    if (!user) {
      const pendingOrder = { bun, fillings };
      localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const ingredientsIds = [bun._id, ...fillings.map((item: TIngredientProps) => item._id)];
    openModal();
    dispatch(createOrder(ingredientsIds));
  };
  if (order) {
  console.log(order.number)}

  return (
    <div className={styles.container} ref={containerRef}>
      {bun && (
        <ConstructorElement
          type='top'
          isLocked={true}
          text={`${bun.name} (верх)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      )}

      <div className={styles.scrollArea}>
        {fillings.length > 0 ? (
          fillings.map((item: TIngredientProps, index: number) => (
            <FillingCard
              key={item._uniqueId}
              ingredient={item}
              index={index}
              moveCard={(from, to) =>
                dispatch(moveFilling({ sourceIndex: from, targetIndex: to }))
              }
              onRemove={(id) => dispatch(removeFilling(id))}
            />
          ))
        ) : (
          !bun && <p className="text text_type_main-medium">Выберите ингредиенты</p>
        )}
      </div>

      {bun && (
        <ConstructorElement
          type='bottom'
          isLocked={true}
          text={`${bun.name} (низ)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      )}

      {(bun || fillings.length > 0) && (
        <div className={styles.footer}>
          <div className={styles.price}>
            <span className="text text_type_digits-medium">{totalPrice}</span>
            <CurrencyIcon type='primary' />
          </div>
          <Button
            htmlType="button"
            type='primary'
            size='large'
            onClick={handleOrderClick}
          >
            {loading ? 'Оформляем заказ' : 'Оформить заказ'}
          </Button>
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal} closeStyle='absolute'>
          {loading ? (
            <div className={styles.waiting}>
            <p className='text text_type_main-large'>Оформляем заказ...</p>
            <Preloader /> 
            </div>
          ) : order ? (
            <OrderDetails orderNumber={order.number} />
          ) : null}
        </Modal>
      )}
    </div>
  );
}
