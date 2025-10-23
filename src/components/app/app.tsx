import styles from './app.module.css';
import AppHeader from '../app-header/app-header';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Home from '../../pages/home/home';
import Profile from '../../pages/profile/profile';
import Register from '../../pages/register/register';
import Login from '../../pages/login/login';
import ResetPassword from '../../pages/reset-password/reset-password';
import ForgotPassword from '../../pages/forgot-password/forgot-password';

import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients, selectIngredientLoading, selectIngredientError } from '../../services/ingredients-slice';
import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';
import { selectIngredientDetails } from '../../services/ingredient-details-slice';
import { Protected } from '../protected-route';
import { checkUserAuth } from '../../services/user-slice';


function App(): React.JSX.Element {
   const dispatch = useDispatch();
   const location = useLocation();
   const navigate = useNavigate();
   
   const background = location.state && location.state.background;
   const [savedBackground, setSavedBackground] = useState<null | Location>(null);
   const [savedIngredientId, setSavedIngredientId] = useState<null | string>(null);


   const loading = useSelector(selectIngredientLoading);
   const error = useSelector(selectIngredientError);
   const ingredient = useSelector(selectIngredientDetails);


   useEffect(() => {
      // @ts-expect-error 'Sprint5'
      dispatch(fetchIngredients());
   }, [dispatch]);

   useEffect(() => {
      // @ts-expect-error 'Sprint5'
      dispatch(checkUserAuth());
   }, [dispatch])

   useEffect(() => {
      const storedBackground = sessionStorage.getItem('background');
      const storedIngredientId = sessionStorage.getItem('ingredientId');
      if (storedBackground) setSavedBackground(JSON.parse(storedBackground));
      if (storedIngredientId) setSavedIngredientId(storedIngredientId);
   }, []);

   useEffect(() => {
      if (background && location.pathname.startsWith('/ingredients/')) {
         const ingredientId = location.pathname.split('/').pop();
         if (ingredientId) {
         sessionStorage.setItem('background', JSON.stringify(background));
         sessionStorage.setItem('ingredientId', ingredientId);
         }}
   }, [background, location.pathname]);

   const handleCloseModal = (): void => {
      sessionStorage.removeItem('background');
      sessionStorage.removeItem('ingredientId');
      navigate(-1);
   }

   if (loading) return <p>Wait</p>;
   if (error) return <p>Ошибка: {error}</p>;

   const activeBackground = background || savedBackground;
   const activeIngredientId =
      location.pathname.startsWith('/ingredients/') && location.pathname.split('/').pop()
         ? location.pathname.split('/').pop()
         : savedIngredientId;

   return (
      <>
         <AppHeader className={styles.wrapper}/>
         <Routes location={activeBackground || location}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Protected component={<Profile />} />} />
            <Route path='/register' element={<Protected onlyUnAuth component={<Register />} />} />
            <Route path='/login' element={<Protected onlyUnAuth component={<Login />} />} />
            <Route path='/reset-password' element={<Protected onlyUnAuth component={<ResetPassword />} />} />
            <Route path='/forgot-password' element={<Protected onlyUnAuth component={<ForgotPassword />}/>} />
            <Route path='/ingredients/:ingredientId'
               element={<IngredientDetails />} />
         </Routes>

         {(activeBackground && activeIngredientId) && (
            <Routes>
               <Route
                  path='/ingredients/:ingredientId'
                  element={
                     <Modal onClose={handleCloseModal} closeStyle='inline' title='Детали ингредиента'>
                        <IngredientDetails ingredient={ingredient} />
                     </Modal>
                  }
               />
            </Routes>
         )}
      </>
   );
}

export default App;
