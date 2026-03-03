import { TIngredientProps } from "../../utils/types/ingredient-types";
import { useLocation, Link } from "react-router-dom";
import { Button, Counter, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './ingredient-card.module.css';
import { useDrag } from "react-dnd";
import useMediaQuery from "../../hooks/useMedia";

type TIngredientCardProps = {
  ingredient: TIngredientProps;
  count: number;
  onClick: (ingredient: TIngredientProps) => void;
  onAdd: (ingredient: TIngredientProps) => void;
}

function IngredientCard({ ingredient, count = 0, onClick, onAdd }: TIngredientCardProps): React.JSX.Element {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [{ isDragging }, dragRef] = useDrag<TIngredientProps, unknown, { isDragging: boolean }>({
    type: 'ingredient',
    item: ingredient,
    canDrag: !isMobile,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  return (
    <div ref={!isMobile ? (dragRef as unknown as React.Ref<HTMLDivElement>) : undefined}
      data-test='ingredient-card-draggable' className={styles.ingredientCard}>
      <Link
        to={`/ingredients/${ingredient._id}`}
        state={{ background: location }}
      >
        <div className={styles.card}
          onClick={() => onClick(ingredient)}
          data-test='ingredient-card'
          data-test-type={ingredient.type}
          data-id={ingredient._id}>
          {count > 0 && <Counter count={count} size='default' data-test='ingredient-counter' />}
          <img src={ingredient.image} alt={ingredient.name} />
          <p className="text text_type_main-medium">{ingredient.price} <CurrencyIcon type="primary" /></p>
          <p className="text text_type_main-default">{ingredient.name}</p>
        </div>
      </Link>

      {isMobile && (
        <button
          className={styles.mobileButton}
          onClick={() => onAdd(ingredient)}
        >
          Добавить
        </button>
      )}
    </div>
  )
};

export default IngredientCard;