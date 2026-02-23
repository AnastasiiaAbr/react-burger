import React from "react";
import { useSelector, useAppDispatch } from "../../services/store";
import { CurrencyIcon, Counter } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './burgerIngredientsMobile.module.css';

import {
  setBun,
  addFilling,
  selectConstructorFillings,
  selectConstructorBun
} from "../../services/slices/constructor-slice";

import {
  setIngredient
} from "../../services/slices/ingredient-details-slice";

import { selectIngredient } from "../../services/slices/ingredients-slice";
import { TIngredientProps } from "../../utils/types/ingredient-types";

type TMobileIngredientCardProps = {
  ingredient: TIngredientProps;
  count: number;
  onAdd: (ingredient: TIngredientProps) => void;
};

function MobileIngredientCard({
  ingredient,
  count,
  onAdd
}: TMobileIngredientCardProps): React.JSX.Element {
  return (
    <div className={styles.mobileCard}>
      {count > 0 && <Counter count={count} size="default" />}

      <img src={ingredient.image} alt={ingredient.name} />

      <div className={styles.mobileInfo}>
        <p className="text text_type_main-default">{ingredient.name}</p>
        <p className="text text_type_digits-default">
          {ingredient.price} <CurrencyIcon type="primary" />
        </p>
      </div>

      <button
        className={styles.addButton}
        onClick={() => onAdd(ingredient)}
      >
        Добавить
      </button>
    </div>
  );
}

type TMobileCategoryProps = {
  title: string;
  items: TIngredientProps[];
  bun: TIngredientProps | null;
  fillings: TIngredientProps[];
  onAdd: (ingredient: TIngredientProps) => void;
};

function MobileCategory({
  title,
  items,
  bun,
  fillings,
  onAdd
}: TMobileCategoryProps) {
  return (
    <div className={styles.mobileCategory}>
      <h2 className="text text_type_main-medium">{title}</h2>

      {items.map(item => {
        let count = 0;

        if (item.type === "bun") {
          count = bun && bun._id === item._id ? 2 : 0;
        } else {
          count = fillings.filter(f => f._id === item._id).length;
        }

        return (
          <MobileIngredientCard
            key={item._id}
            ingredient={item}
            count={count}
            onAdd={onAdd}
          />
        );
      })}
    </div>
  );
}

export default function BurgerIngredientsMobile(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const ingredients = useSelector(selectIngredient) as TIngredientProps[];
  const bun = useSelector(selectConstructorBun);
  const fillings = useSelector(selectConstructorFillings);

  const buns = ingredients.filter(i => i.type === "bun");
  const sauces = ingredients.filter(i => i.type === "sauce");
  const mains = ingredients.filter(i => i.type === "main");

  const handleAdd = (ingredient: TIngredientProps) => {
    dispatch(setIngredient(ingredient));

    if (ingredient.type === "bun") {
      dispatch(setBun(ingredient));
    } else {
      dispatch(addFilling(ingredient));
    }
  };

  return (
    <div className={styles.mobileContainer}>
      <MobileCategory
        title="Булки"
        items={buns}
        bun={bun}
        fillings={fillings}
        onAdd={handleAdd}
      />

      <MobileCategory
        title="Соусы"
        items={sauces}
        bun={bun}
        fillings={fillings}
        onAdd={handleAdd}
      />

      <MobileCategory
        title="Начинки"
        items={mains}
        bun={bun}
        fillings={fillings}
        onAdd={handleAdd}
      />
    </div>
  );
}
