import React from "react";
import styles from './ingredient-details.module.css';
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIngredient } from "../../services/ingredients-slice";
import { TIngredientDetailProps, TIngredientProps } from "../../utils/types/ingredient-types";

const IngredientDetails = ({ingredient}: TIngredientDetailProps): React.JSX.Element => {
  const { ingredientId } = useParams();
  const ingredients = useSelector(selectIngredient);

  const currentIngredient: TIngredientProps | undefined = ingredient || ingredients.find((item: TIngredientProps) => item._id === ingredientId);

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


export default IngredientDetails;