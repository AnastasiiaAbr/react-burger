import styles from './order-history.module.css';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentOrder } from '../../services/order-slice';


//const OrderHistory = () : React.JSX.Element => {
//  const currentOrder = useSelector(selectCurrentOrder);

  //return (
 //  <>
 //  <span>{currentOrder._id}</span>
  // <div className={styles.ingredientImages}>
  //  <ul>
  //    <li className={styles.circleImage}>
  //      <img src={currentOrder.ingredient.image}/>
   //   </li>
  //  </ul>
  // </div>
 //  </> 
//  )
//}