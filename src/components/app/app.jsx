import styles from './app.module.css';
import AppHeader from '../app-header/app-header';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import Home from '../../pages/home/home';

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
         <Routes>
            <Route path='/' element={<Home />} />;
         </Routes>
      </>
   );
}

export default App;
