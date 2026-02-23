import { TIngredientProps } from "../../utils/types/ingredient-types";
import { useLocation, Link } from "react-router-dom";
import { Counter, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './ingredient-card.module.css';
import { useDrag } from "react-dnd";
import useMediaQuery from "../../hooks/useMedia";

type TIngredientCardProps = {
  ingredient: TIngredientProps;
  count: number;
  onClick: (ingredient: TIngredientProps) => void;
}

function IngredientCard({ ingredient, count = 0, onClick }: TIngredientCardProps): React.JSX.Element {
  const location = useLocation();
  const isMobile = useMediaQuery('max-width: 768px');

  const [{ isDragging }, dragRef] = useDrag<TIngredientProps, unknown, { isDragging: boolean }>({
    type: 'ingredient',
    item: ingredient,
    canDrag: !isMobile,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  const ref = isMobile ? undefined : dragRef;
  
  return (
    <div ref={dragRef as unknown as React.Ref<HTMLDivElement>}
    data-test='ingredient-card-draggable'>
      <Link
        to={`/ingredients/${ingredient._id}`}
        state={{ background: location }}
      >
        <div className={styles.card}
          onClick={() => onClick(ingredient)}
          data-test='ingredient-card'
          data-test-type={ingredient.type}
          data-id={ingredient._id}>
          {count > 0 && <Counter count={count} size='default' data-test='ingredient-counter'/>}
          <img src={ingredient.image} alt={ingredient.name} />
          <p className="text text_type_main-medium">{ingredient.price} <CurrencyIcon type="primary" /></p>
          <p className="text text_type_main-default">{ingredient.name}</p>
        </div>
      </Link>
    </div>
  )
};

export default IngredientCard;