import styles from './app.module.css';
import AppHeader from '../app-header/app-header';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Home from '../../pages/home/home';
import Register from '../../pages/register/register';
import Login from '../../pages/login/login';
import ResetPassword from '../../pages/reset-password/reset-password';
import ForgotPassword from '../../pages/forgot-password/forgot-password';
import ProfilePage from '../../pages/profile/profile-page/profile-page';

import {
  fetchIngredients,
  selectIngredientLoading,
  selectIngredientError
} from '../../services/slices/ingredients-slice';

import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';
import { selectIngredientDetails } from '../../services/slices/ingredient-details-slice';
import { Protected } from '../protected-route';
import { checkUserAuth } from '../../services/slices/user-slice';
import { ProfileLayout } from '../../pages/profile/profile-layout/profile-layout';
import { useAppDispatch, useSelector } from '../../services/store';
import { FeedPage } from '../../pages/feed/feed';
import { ProfileOrders } from '../../pages/profile/profile-orders/profile-orders';
import { OrderModalContent } from '../wsorder-content/wsorder-content';
import { OrderDetailPage } from '../../pages/order-details/order-details';
import { useOrderFromWs } from '../../hooks/useOrderFromWs';


function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  const loading = useSelector(selectIngredientLoading);
  const error = useSelector(selectIngredientError);
  const ingredient = useSelector(selectIngredientDetails);

  const profileOrders = useSelector((state) => state.profileOrders.orders);
  const feedOrders = useSelector((state) => state.feedOrders.orders);
  const allIngredients = useSelector((state) => state.ingredients.items);


  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseModal = () => navigate(-1);

  const orderId = Number(location.pathname.split('/').pop());

  const profileOrder = useOrderFromWs(profileOrders, allIngredients, orderId);
  const order = useOrderFromWs(feedOrders, allIngredients, orderId);
  if (loading) return <p>Wait</p>;
  if (error) return <p>Ошибка: {error}</p>;


  return (
    <>
      <AppHeader className={styles.wrapper} />

      <Routes location={background || location}>
        <Route path='/' element={<Home />} />
        <Route path="/profile" element={<Protected component={<ProfileLayout />} />}>
          <Route index element={<ProfilePage />} />
          <Route path="orders" element={<Protected component={<ProfileOrders />} />} />
        </Route>
        <Route
          path="/profile/orders/:id"
          element={
            <Protected component={
              <OrderDetailPage wsOrders={profileOrders} allIngredients={allIngredients} />
            } />
          } />


        <Route path='/register' element={<Protected onlyUnAuth component={<Register />} />} />
        <Route path='/login' element={<Protected onlyUnAuth component={<Login />} />} />
        <Route path='/reset-password' element={<Protected onlyUnAuth component={<ResetPassword />} />} />
        <Route path='/forgot-password' element={<Protected onlyUnAuth component={<ForgotPassword />} />} />

        <Route path='/ingredients/:ingredientId' element={<IngredientDetails />} />
        <Route path='/feed' element={<FeedPage />} />
        <Route
          path="/feed/:id"
          element={
            <OrderDetailPage wsOrders={feedOrders} allIngredients={allIngredients} />
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:ingredientId'
            element={
              <Modal onClose={handleCloseModal} title='Детали ингредиента' titleStyle='main'>
                <IngredientDetails ingredient={ingredient} />
              </Modal>
            }
          />


          {order && (
            <Route
              path="/feed/:id"
              element={
                <Modal title={`#${order.number}`}
                  onClose={handleCloseModal}
                  titleStyle='number'>
                  <OrderModalContent
                    order={order}
                  />
                </Modal>
              }
            />)}

          {profileOrder &&
            (<Route
              path="/profile/orders/:id"
              element={
                <Modal onClose={handleCloseModal} title={`#${profileOrder.number}`} titleStyle='number'>
                  <OrderModalContent
                    order={profileOrder}
                  />
                </Modal>
              }
            />)}
        </Routes>
      )}

    </>
  );

}
export default App;
