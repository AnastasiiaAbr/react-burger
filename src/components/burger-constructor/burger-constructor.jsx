import React, { useRef, useMemo, useEffect } from 'react';
import { Button, ConstructorElement, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';
import { useModal } from '../../hooks/useModal';
import { useDrag, useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { selectConstructorBun, selectConstructorFillings, removeFilling, setBun, addFilling, moveFilling
} from '../../services/constructorSlice';
import { createOrder, selectCurrentOrder, selectOrderLoading } from '../../services/orderSlice';

function FillingCard({ ingredient, index, moveCard, onRemove }) {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'filling',
    hover(item, monitor) {
      if (!ref.current) return;
      const sourceIndex = item.index;
      const targetIndex = index;
      if (sourceIndex === targetIndex) return;

      const targetRect = ref.current.getBoundingClientRect();
      const targetMiddleY = (targetRect.bottom - targetRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - targetRect.top;

      if (sourceIndex < targetIndex && hoverClientY < targetMiddleY) return;
      if (sourceIndex > targetIndex && hoverClientY > targetMiddleY) return;

      moveCard(sourceIndex, targetIndex);
      item.index = targetIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'filling',
    item: { ingredient, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={styles.ingredient}>
      <DragIcon type='primary' />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => onRemove(ingredient._id)}
      />
    </div>
  );
}

FillingCard.propTypes = {
  ingredient: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default function BurgerConstructor() {
  const dispatch = useDispatch();
  const { isModalOpen, openModal, closeModal } = useModal();

  const [{ isOver }, dropRef] = useDrop({
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

  const bun = useSelector(selectConstructorBun);
  const fillings = useSelector(selectConstructorFillings);
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrderLoading);

  const totalPrice = useMemo(() => {
    return (bun ? bun.price * 2 : 0) + fillings.reduce((sum, item) => sum + item.price, 0);
  }, [bun, fillings]);

  const handleOrderClick = () => {
    if (!bun) {
      alert('Выберите булку для оформления заказа');
      return;
    }
    if (fillings.length === 0) {
      alert('Добавьте хотя бы один ингредиент');
      return;
    }
    const ingredientsIds = [
      bun._idAPI,
      ...fillings.map(item => item._idAPI)
    ];

    dispatch(createOrder(ingredientsIds));
  };

  useEffect(() => {
    if (order) {
      openModal();
    }
  }, [order, openModal]);

  return (
    <div className={styles.container} ref={dropRef}>
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
        {fillings.length > 0
          ? fillings.map((item, index) => (
            <FillingCard
              key={item._id}
              ingredient={item}
              index={index}
              moveCard={(from, to) => dispatch(moveFilling({ sourceIndex: from, targetIndex: to }))}
              onRemove={(id) => dispatch(removeFilling(id))}
            />
          ))
          : !bun && <p className="text text_type_main-medium">Выберите ингредиенты</p>}
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
          <Button htmlType="button" type='primary' size='large' onClick={handleOrderClick}>
            {loading ? 'Оформляем заказ' : 'Оформить заказ'}
          </Button>
        </div>
      )}

      {isModalOpen && order && (
        <Modal onClose={closeModal} closeStyle='absolute'>
          <OrderDetails orderNumber={order.number} />
        </Modal>
      )}
    </div>
  );
}
