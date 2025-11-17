import React from 'react';
import { TOrder } from '../../utils/types/order-types';
import styles from './wsorder-content.module.css';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';

type OrderModalContentProps = {
  order: TOrder;
};

const STATUS_RU: Record<'created' | 'pending' | 'done', string> = {
  created: 'Создан',
  pending: 'В работе',
  done: 'Выполнен',
};

export function OrderModalContent({ order }: OrderModalContentProps): React.JSX.Element {

  const ingredientCounts: Record<string, {ingredient: typeof order.ingredients[0]; count: number}> = {}

  order.ingredients.forEach(ing => {
    if (ingredientCounts[ing._id]) {
      ingredientCounts[ing._id].count+=1;
    } else {
      ingredientCounts[ing._id] = { ingredient: ing, count: 1}
    }
  });

  const totalPrice = order.ingredients.reduce((sum, ing) => sum + ing.price, 0);

  return (
    <div className={styles.modal}>
      <p className={`${styles.modalNumber} text text_type_digits-default`}>
        #{order.number}
      </p>
      <p className={`${styles.ingredientName} text text_type_main-medium`}>
        {order.name}
      </p>
      <p
        className={`${styles.statusModal} text text_type_main-small ${
          order.status === 'done' ? styles.statusDone : ''
        }`}
      >
        {STATUS_RU[order.status]}
      </p>
      <p className={`${styles.ingredientContains} text text_type_main-medium`}>
        Состав:
      </p>
      <ul className={styles.listModal}>
        {Object.values(ingredientCounts).map(({ ingredient, count }) => (
          <li key={ingredient._id} className={styles.ingredientItem}>
            <div className={styles.leftSide}>
              <img src={ingredient.image} alt={ingredient.name} className={styles.ingredientImage} />
              <span className={styles.ingredientName}>{ingredient.name}</span>
            </div>
            <span className={`${styles.ingredientPrice} text text_type_digits-default`}>
              {count} × {ingredient.price} <CurrencyIcon type="primary" />
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.bottomModal}>
        <p className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </p>
        <p className={`${styles.ingredientPrice} text text_type_digits-default`}>
          {totalPrice} <CurrencyIcon type="primary" />
        </p>
      </div>
    </div>
  );
}
