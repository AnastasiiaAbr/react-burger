import styles from './app.module.css';
import AppHeader from '../app-header/app-header';
import BurgerIngredients from '../burger-ingredients/burger-ingredients';
import { useEffect } from 'react';
import BurgerConstructor from '../burger-constructor/burger-constructor';

import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients, selectIngredientLoading, selectIngredientError } from '../../services/ingredientsSlice';


function App() {
   const dispatch = useDispatch();

   const loading = useSelector(selectIngredientLoading);
   const error = useSelector(selectIngredientError);

   useEffect(() => {
      dispatch(fetchIngredients());
   }, [dispatch]);

   if (loading) return <p>Загрузка...</p>;
   if (error) return <p>Ошибка: {error}</p>;

   return (
      <>
         <AppHeader className={styles.wrapper} />
         <main className={styles.wrapper}>
            <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>

            <section className={styles.content}>
               <BurgerIngredients />
               <BurgerConstructor />
            </section>
         </main>
      </>
   );
}

export default App;
