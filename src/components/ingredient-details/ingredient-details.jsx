import React from "react";
import PropTypes from 'prop-types';
import styles from './ingredient-details.module.css';
import {ingredientPropType} from "../../utils/prop-types/ingredient-prop-types";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIngredient } from "../../services/ingredients-slice";


const IngredientDetails = ({ingredient}) => {
  const { ingredientId } = useParams();
  const ingredients = useSelector(selectIngredient);

  const currentIngredient = 
  ingredient || ingredients.find(item => item._id === ingredientId);

  if (!currentIngredient) {
    return <p className="text text_type_main-default">Ингредиент не найден</p>;
  };

  return (
    <div className={styles.details}>
      <img className={styles.image}
      src={currentIngredient.image_large}
      alt={currentIngredient.name}
      />
      <p className="text text_type_main-medium">{currentIngredient.name}</p>

      <ul className={styles.nutritionList}>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Калории,ккал</span>
          <span className="text text_type_digits-default">{currentIngredient.calories}</span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Белки, г</span>
          <span className="text text_type_digits-default">{currentIngredient.proteins}</span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Жиры, г</span>
          <span className="text text_type_digits-default">{currentIngredient.fat}</span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Углеводы, г</span>
          <span className="text text_type_digits-default">{currentIngredient.carbohydrates}</span>
        </li>
      </ul>
    </div>
  );
};

IngredientDetails.propTypes = {
  ingredient: ingredientPropType,
}

export default IngredientDetails;