import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ConstructorElement, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';
import { ingredientPropType } from '../../utils/prop-types/ingredient-prop-types';

function BurgerConstructor({ bun, fillings, onRemoveIngredient }) {
  const [orderId, setOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPrice = (bun ? bun.price * 2 : 0) + fillings.reduce((sum, item) => sum + item.price, 0);

  const handleOrderClick = () => {
    setOrderId(34536);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderId(null);
  }

  return (
    <div className={styles.container}>
      {bun && (
        <div className={styles.ingredient}>
          <ConstructorElement
            type='top'
            isLocked={true}
            text={`${bun.name}(верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={styles.scrollArea}>
        {fillings.length > 0 ? (
          fillings.map((item, index) => (
            <div key={index} className={styles.ingredient}>
              <DragIcon type="primary" />

              <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
                handleClose={() => onRemoveIngredient(index)}
              />
              </div>
          ))
        ) : (
          !bun && (
            <p className="text text_type_main-medium">Выберите ингредиенты</p>
          )
        )}
      </div>

      {bun && (
        <div className={styles.ingredient}>
          <ConstructorElement
            type='bottom'
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      {(bun || fillings.length > 0) && (
        <div className={styles.footer}>
          <div className={styles.price}>
            <span className="text text_type_digits-medium">{totalPrice}</span>
            <CurrencyIcon type='primary' />
          </div>
          <Button type='primary' size='large' onClick={handleOrderClick}>
            Оформить заказ
          </Button>
        </div>
        )}

        {isModalOpen && (
        <Modal onClose={closeModal} closeStyle='absolute'>
          <OrderDetails orderId={orderId} />
        </Modal>
      )}
    </div>
  )
};

BurgerConstructor.propTypes = {
  bun: PropTypes.oneOfType([ingredientPropType, PropTypes.oneOf([null])]),
  fillings: PropTypes.arrayOf(ingredientPropType).isRequired,
  onRemoveIngredient: PropTypes.func.isRequired,
};


export default BurgerConstructor;