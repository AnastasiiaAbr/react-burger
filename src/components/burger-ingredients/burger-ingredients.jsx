import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { Tab, CurrencyIcon, Counter } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './burger-ingredients.module.css';
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { ingredientPropType } from '../../utils/prop-types/ingredient-prop-types'
import { useModal } from "../../hooks/useModal";
import { useDrag } from "react-dnd";

import { selectIngredient} from '../../services/ingredientsSlice';
import { setBun, addFilling, selectConstructorFillings, selectConstructorBun } from "../../services/constructorSlice";
import { selectIngredientDetails, setIngredient, clearIngredient } from "../../services/ingredientDetailsSlice";

function IngredientCard({ ingredient, count = 0, onClick }) {
  const [{isDragging}, dragRef] = useDrag({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });
  return (
    <div className={styles.card} onClick={() => onClick(ingredient)} ref={dragRef}>
      {count > 0 && <Counter count={count} size='default' />}
      <img src={ingredient.image} alt={ingredient.name} />
      <p className="text text_type_main-medium">{ingredient.price} <CurrencyIcon /></p>
      <p className="text text_type_main-default">{ingredient.name}</p>
    </div>
  )
}

IngredientCard.propTypes = {
  ingredient: ingredientPropType.isRequired,
  count: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

function IngredientCategory({ title, items, innerRef, bun, fillings, onIngredientClick}) {
  return (
    <div className={styles.category} ref={innerRef}>
      <h2 className="text text_type_main-large">{title}</h2>
      <div className={styles.categoryItems}>
        {items.map(item => {
          let count = 0;

          if (item.type === 'bun') {
            count = bun && bun._id === item._id ? 2 : 0;
          } else {
            count = fillings.filter(el => el._idAPI === item._id).length;
          }


          return (
            <IngredientCard
              key={item._id}
              ingredient={item}
              count={count}
              onClick={onIngredientClick} />
          );
        })}
      </div>
    </div>
  );
}

IngredientCategory.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(ingredientPropType).isRequired,
  innerRef: PropTypes.object,
  bun: PropTypes.oneOfType([
  ingredientPropType,
  PropTypes.oneOf([null])
]),
  fillings: PropTypes.arrayOf(ingredientPropType).isRequired,
  onIngredientClick: PropTypes.func.isRequired,
}

export default function BurgerIngredients() {
  const dispatch = useDispatch();
  const { isModalOpen, openModal, closeModal} = useModal();

  const ingredients = useSelector(selectIngredient);
  const bun = useSelector(selectConstructorBun);
  const fillings = useSelector(selectConstructorFillings);
  const selectedIngredient = useSelector(selectIngredientDetails);


  const [currentTab, setCurrentTab] = useState('bun');

  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);
  const scrollRef = useRef(null);

  const buns = ingredients.filter(item => item.type === 'bun');
  const sauces = ingredients.filter(item => item.type === 'sauce');
  const mains = ingredients.filter(item => item.type === 'main');

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    if (tab === 'bun' && bunRef.current) {
      bunRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'sauce' && sauceRef.current) {
      sauceRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'main' && mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const bunTop = Math.abs(bunRef.current.getBoundingClientRect().top - container.getBoundingClientRect().top);
      const sauceTop = Math.abs(sauceRef.current.getBoundingClientRect().top - container.getBoundingClientRect().top );
      const mainTop = Math.abs(mainRef.current.getBoundingClientRect().top - container.getBoundingClientRect().top);

      const minDistance = Math.min(bunTop, sauceTop, mainTop);

      if (minDistance === bunTop) setCurrentTab('bun');
      else if (minDistance === sauceTop) setCurrentTab('sauce');
      else setCurrentTab('main');
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleIngredientClick = (ingredient) => {
    dispatch(setIngredient(ingredient));
    if (ingredient.type === 'bun') {
      dispatch(setBun(ingredient));
    } else {
      dispatch(addFilling(ingredient));
    };
    openModal();
  };

  const handleCloseModal = () => {
    dispatch(clearIngredient());
    closeModal()
};

  return (
    <>
      <div className={`${styles.container}`}>

        <div className={`${styles.tabs}`}>
          <Tab value="bun" active={currentTab === "bun"} onClick={() => handleTabClick('bun')}>Булки</Tab>
          <Tab value="sauce" active={currentTab === "sauce"} onClick={() => handleTabClick('sauce')}>Соусы</Tab>
          <Tab value="main" active={currentTab === "main"} onClick={() => handleTabClick('main')}>Начинки</Tab>
        </div>


        <div className={`${styles.scrollArea} mt-10`} ref={scrollRef}>
          <IngredientCategory title='Булки' items={buns} innerRef={bunRef} bun={bun} fillings={fillings} onIngredientClick={handleIngredientClick} />
          <IngredientCategory title='Соусы' items={sauces} innerRef={sauceRef} bun={bun} fillings={fillings} onIngredientClick={handleIngredientClick} />
          <IngredientCategory title='Начинки' items={mains} innerRef={mainRef} bun={bun} fillings={fillings} onIngredientClick={handleIngredientClick} />
        </div>
      </div >

      {isModalOpen && selectedIngredient && (
        <Modal title='Детали ингредиента' onClose={handleCloseModal} closeStyle='inline'>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
}
