import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tab, CurrencyIcon, Counter } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './burger-ingredients.module.css';
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { useDrag } from "react-dnd";

import { selectIngredient } from '../../services/ingredients-slice';
import { setBun, addFilling, selectConstructorFillings, selectConstructorBun } from "../../services/constructor-slice";
import { selectIngredientDetails, setIngredient, clearIngredient } from "../../services/ingredient-details-slice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {  TIngredientProps } from "../../utils/types/ingredient-types";

type TIngredientCardProps = {
  ingredient: TIngredientProps;
  count: number;
  onClick: (ingredient: TIngredientProps) => void;
}

function IngredientCard({ ingredient, count = 0, onClick }: TIngredientCardProps) : React.JSX.Element {
  const location = useLocation();

  const [{ isDragging }, dragRef] = useDrag<TIngredientProps, unknown, { isDragging: boolean }>({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });
  return (
    <div ref={dragRef as unknown as React.Ref<HTMLDivElement>}>
    <Link
      to={`/ingredients/${ingredient._id}`}
      state={{ background: location }}
    >
      <div className={styles.card} onClick={() => onClick(ingredient)}>
        {count > 0 && <Counter count={count} size='default' />}
        <img src={ingredient.image} alt={ingredient.name} />
        <p className="text text_type_main-medium">{ingredient.price} <CurrencyIcon type="primary"/></p>
        <p className="text text_type_main-default">{ingredient.name}</p>
      </div>
    </Link>
    </div>
  )
};

type TIngredientCategoryProps = {
  title: string;
  items: TIngredientProps[];
  innerRef: React.RefObject<HTMLDivElement | null>;
  bun: TIngredientProps;
  fillings: TIngredientProps[];
  onIngredientClick: (ingredient: TIngredientProps) => void;
};

function IngredientCategory({ title, items, innerRef, bun, fillings, onIngredientClick }: TIngredientCategoryProps): React.JSX.Element {
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


export default function BurgerIngredients() : React.JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const ingredients = useSelector(selectIngredient) as TIngredientProps[];
  const bun = useSelector(selectConstructorBun);
  const fillings = useSelector(selectConstructorFillings);
  const selectedIngredient = useSelector(selectIngredientDetails);
  const background = location.state?.background;


  const [currentTab, setCurrentTab] = useState('bun');

  const bunRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const buns = ingredients.filter(item => item.type === 'bun');
  const sauces = ingredients.filter(item => item.type === 'sauce');
  const mains = ingredients.filter(item => item.type === 'main');

  const handleTabClick = (tab: 'bun' | 'sauce' | 'main') => {
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
      if (!bunRef.current || !sauceRef.current || !mainRef.current) return;
      const bunTop = Math.abs(bunRef.current.getBoundingClientRect().top - container.getBoundingClientRect().top);
      const sauceTop = Math.abs(sauceRef.current.getBoundingClientRect().top - container.getBoundingClientRect().top);
      const mainTop = Math.abs(mainRef.current.getBoundingClientRect().top - container.getBoundingClientRect().top);

      const minDistance = Math.min(bunTop, sauceTop, mainTop);

      if (minDistance === bunTop) setCurrentTab('bun');
      else if (minDistance === sauceTop) setCurrentTab('sauce');
      else setCurrentTab('main');
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleIngredientClick = (ingredient: TIngredientProps) => {
    dispatch(setIngredient(ingredient));
    if (ingredient.type === 'bun') {
      dispatch(setBun(ingredient));
    } else {
      dispatch(addFilling(ingredient));
    };
    navigate(`/ingredients/${ingredient._id}`, { state: { background: location } })
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

      {background && selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={() => navigate(-1)} closeStyle="inline">
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
}