import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Tab, CurrencyIcon, Counter } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './burger-ingredients.module.css';
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { ingredientPropType } from '../../utils/prop-types/ingredient-prop-types'


function IngredientCard({ ingredient, count, onClick }) {
  return (
    <div className={styles.card} onClick={() => onClick(ingredient)}>
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

IngredientCard.defaultProps = {
  count: 0,
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
            count = fillings.filter(el => el._id === item._id).length;
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

IngredientCategory.propTypes = ({
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(ingredientPropType).isRequired,
  innerRef: PropTypes.shape({current:PropTypes.instanceOf(Element)}),
  bun: PropTypes.oneOfType([
  ingredientPropType,
  PropTypes.oneOf([null])
]),
  fillings: PropTypes.arrayOf(ingredientPropType).isRequired,
  onIngredientClick: PropTypes.func.isRequired,
})

function BurgerIngredients({ ingredients, bun, fillings, onAddIngredient }) {
  const [currentTab, setCurrentTab] = useState('bun');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);

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

  const handleIngredientClick = (ingredient) => {
    setSelectedIngredient(ingredient);
    onAddIngredient(ingredient);
  };

  const closeModal = () => {
    setSelectedIngredient(null);
  };

  return (
    <>
      <div className={`${styles.container}`}>

        <div className={`${styles.tabs}`}>
          <Tab value="bun" active={currentTab === "bun"} onClick={() => handleTabClick('bun')}>Булки</Tab>
          <Tab value="sauce" active={currentTab === "sauce"} onClick={() => handleTabClick('sauce')}>Соусы</Tab>
          <Tab value="main" active={currentTab === "main"} onClick={() => handleTabClick('main')}>Начинки</Tab>
        </div>


        <div className={`${styles.scrollArea} mt-10`}>
          <IngredientCategory title='Булки' items={buns} innerRef={bunRef} bun={bun} fillings={fillings} onIngredientClick={handleIngredientClick} />
          <IngredientCategory title='Соусы' items={sauces} innerRef={sauceRef} bun={bun} fillings={fillings} onIngredientClick={handleIngredientClick} />
          <IngredientCategory title='Начинки' items={mains} innerRef={mainRef} bun={bun} fillings={fillings} onIngredientClick={handleIngredientClick} />
        </div>
      </div >

      {selectedIngredient && (
        <Modal title='Детали ингредиента' onClose={closeModal} closeStyle='inline'>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
}

BurgerIngredients.propTypes = ({
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
  bun: PropTypes.oneOfType([
  ingredientPropType,
  PropTypes.oneOf([null])
]),
  fillings: PropTypes.arrayOf(ingredientPropType).isRequired,
  onAddIngredient: PropTypes.func.isRequired,
});

export default BurgerIngredients;
