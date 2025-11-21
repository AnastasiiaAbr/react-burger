import React from "react";
import styles from './order-card.module.css';
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { TOrderProps } from "../../utils/types/order-types";
import { FormattedDate } from "@ya.praktikum/react-developer-burger-ui-components";


export function OrderCard({ order, onClick, showStatus = false }: TOrderProps): React.JSX.Element {
  const totalPrice = order.ingredients?.reduce((sum, items) => sum + (items?.price ?? 0), 0) ?? 0;

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={new Date(order.createdAt)}/>
        </span>
      </div>

      <p className={`${styles.name} text text_type_main-medium`}>{order.name}</p>

      {showStatus && <p className={styles.status}>{order.status}</p>}

      <div className={styles.bottom}>
      <div className={styles.imagesContainer}>
  {order.ingredients
    ?.filter((ing): ing is NonNullable<typeof ing> => Boolean(ing))
    .slice(0, 6)
    .map((ingredient, index) => {
      const isLastVisible = index === 5;
      const remainingCount = order.ingredients!.length - 5;
      const wrapperClass = `${styles.imageWrapper} ${styles[`imageIndex${index}`]}`;

      return (
        <div key={`${ingredient._id}-${index}`} className={wrapperClass}>
          <img
            src={ingredient.image ?? ''}
            alt={ingredient.name ?? 'ingredient'}
            className={styles.image}
          />
          {isLastVisible && order.ingredients!.length > 6 && (
            <div className={styles.overlay}>+{remainingCount}</div>
          )}
        </div>
      );
    })}
</div>
        <span className='text text_type_digits-default'>
          {totalPrice} <CurrencyIcon type="primary" />
        </span>
      </div>
    </div>
  );
}
