import React from "react";
import PropTypes from 'prop-types';
import styles from './order-details.module.css';
import { CheckMarkIcon } from "@ya.praktikum/react-developer-burger-ui-components";

const OrderDetails = ({orderId}) => {
  return (
    <div className={styles.details}>
      <p className={`${styles.orderId} text text_type_digits-large`}>{orderId}</p>
      <p className='text text_type_main-medium mt-8 mb-15'>Идентификатор заказа</p>
      <CheckMarkIcon type="primary" />
      <p className='text text_type_main-default mt-15 mb-2'>Ваш заказ начали готовить</p>
      <p className='text text_type_main-default text_color_inactive'>Дождитесь готовности на орбитальной станции</p>
    </div>
  )
}

OrderDetails.propTypes = {
  orderId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};

export default OrderDetails;