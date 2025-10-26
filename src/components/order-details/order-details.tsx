import React from "react";
import styles from './order-details.module.css';
import { CheckMarkIcon } from "@ya.praktikum/react-developer-burger-ui-components";

type TOrderDetailsProps = {
  orderNumber: string | number;
}

const OrderDetails = ({orderNumber}: TOrderDetailsProps): React.JSX.Element => {
  return (
    <div className={styles.details}>
      <p className={`${styles.orderId} text text_type_digits-large`}>{orderNumber}</p>
      <p className='text text_type_main-medium mt-8 mb-15'>Идентификатор заказа</p>
      <CheckMarkIcon type="primary" />
      <p className='text text_type_main-default mt-15 mb-2'>Ваш заказ начали готовить</p>
      <p className='text text_type_main-default text_color_inactive'>Дождитесь готовности на орбитальной станции</p>
    </div>
  )
};

export default OrderDetails;