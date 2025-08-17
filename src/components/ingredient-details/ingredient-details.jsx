import React from "react";
import PropTypes from 'prop-types';
import styles from './ingredient-details.module.css';
import {ingredientPropType} from "../../utils/prop-types/ingredient-prop-types";

const IngredientDetails = ({ingredient}) => {
  if (!ingredient) return null;

  return (
    <div className={styles.details}>
      <img className={styles.image}
      src={ingredient.image_large}
      alt={ingredient.name}
      />
      <p className="text text_type_main-medium">{ingredient.name}</p>

      <ul className={styles.nutritionList}>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Калории,ккал</span>
          <span className="text text_type_digits-default">{ingredient.calories}</span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Белки, г</span>
          <span className="text text_type_digits-default">{ingredient.proteins}</span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Жиры, г</span>
          <span className="text text_type_digits-default">{ingredient.fat}</span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Углеводы, г</span>
          <span className="text text_type_digits-default">{ingredient.carbohydrates}</span>
        </li>
      </ul>
    </div>
  );
};

IngredientDetails.propTypes = ({
  ingredient: ingredientPropType,
})

export default IngredientDetails;