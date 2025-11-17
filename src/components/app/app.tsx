import styles from './app.module.css';
import AppHeader from '../app-header/app-header';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Home from '../../pages/home/home';
import Register from '../../pages/register/register';
import Login from '../../pages/login/login';
import ResetPassword from '../../pages/reset-password/reset-password';
import ForgotPassword from '../../pages/forgot-password/forgot-password';
import ProfilePage from '../../pages/profile/profile-page/profile-page';

import { RootState } from '../../services/root-reducer';

import {
  fetchIngredients,
  selectIngredientLoading,
  selectIngredientError
} from '../../services/slices/ingredients-slice';

import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';
import { selectIngredientDetails } from '../../services//slices/ingredient-details-slice';
import { Protected } from '../protected-route';
import { checkUserAuth } from '../../services/slices/user-slice';
import { ProfileLayout } from '../../pages/profile/profile-layout/profile-layout';
import { useAppDispatch, useSelector } from '../../services/store';
import { FeedPage } from '../../pages/feed/feed';
import { ProfileOrders } from '../../pages/profile/profile-orders/profile-orders';
import { TOrderFromWs } from '../../services/slices/ws-slice';
import { OrderModalContent } from '../wsorder-content/wsorder-content';
import { TOrder } from '../../utils/types/order-types';
import { TIngredientProps } from '../../utils/types/ingredient-types';


function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state && location.state.background;

  const [savedBackground, setSavedBackground] = useState<null | Location>(null);
  const [savedIngredientId, setSavedIngredientId] = useState<null | string>(null);
  const [savedFeedId, setSavedFeedId] = useState<null | string>(null);
  const [savedProfileOrderIds, setSavedProfileOrderIds] = useState<null | string>(null);

  const loading = useSelector(selectIngredientLoading);
  const error = useSelector(selectIngredientError);
  const ingredient = useSelector(selectIngredientDetails);

  const profileOrders = useSelector((state: RootState) => state.profileOrders.orders);
  const feedOrders = useSelector((state: RootState) => state.feedOrders.orders);
  const allIngredients = useSelector((state: RootState) => state.ingredients.items);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    const storedBackground = sessionStorage.getItem('background');
    const storedIngredientId = sessionStorage.getItem('ingredientId');
    const storedFeedId = sessionStorage.getItem('feedId');
    const storedProfileId = sessionStorage.getItem('profileId');

    if (storedBackground) setSavedBackground(JSON.parse(storedBackground));
    if (storedIngredientId) setSavedIngredientId(storedIngredientId);
    if (storedFeedId) setSavedFeedId(storedFeedId);
    if (storedProfileId) setSavedProfileOrderIds(storedProfileId);
  }, []);

  useEffect(() => {
    if (background && location.pathname.startsWith('/ingredients/')) {
      const ingredientId = location.pathname.split('/').pop();
      if (ingredientId) {
        sessionStorage.setItem('background', JSON.stringify(background));
        sessionStorage.setItem('ingredientId', ingredientId);
      }
    }

    if (background && location.pathname.startsWith('/feed/')) {
      const feedId = location.pathname.split('/').pop();
      if (feedId) {
        sessionStorage.setItem('background', JSON.stringify(background));
        sessionStorage.setItem('feedId', feedId);
      }
    }

    if (background && location.pathname.startsWith('/profile/orders/')) {
      const profileId = location.pathname.split('/').pop();
      if (profileId) {
        sessionStorage.setItem('background', JSON.stringify(background));
        sessionStorage.setItem('profileId', profileId);
      }
    }
  }, [background, location.pathname]);


  const handleCloseModal = (): void => {
    sessionStorage.removeItem('background');
    sessionStorage.removeItem('ingredientId');
    sessionStorage.removeItem('feedId');
    sessionStorage.removeItem('profileId');
    navigate(-1);
  };


  if (loading) return <p>Wait</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const activeBackground = background || savedBackground;

  const activeIngredientId =
    location.pathname.startsWith('/ingredients/') && location.pathname.split('/').pop()
      ? location.pathname.split('/').pop()
      : savedIngredientId;

  const activeFeedId =
    location.pathname.startsWith('/feed/') && location.pathname.split('/').pop()
      ? location.pathname.split('/').pop()
      : savedFeedId;

  const activeProfileOrdId =
    location.pathname.startsWith('/profile/orders/') && location.pathname.split('/').pop()
      ? location.pathname.split('/').pop()
      : savedProfileOrderIds;

  const orderFromWs: TOrderFromWs | undefined = activeFeedId
    ? feedOrders.find(o => o.number === Number(activeFeedId))
    : undefined;

  const profileOrderFromWs: TOrderFromWs | undefined = activeProfileOrdId
    ? profileOrders.find(o => o.number === Number(activeProfileOrdId))
    : undefined;


  const order: TOrder | undefined = orderFromWs
    ? {
      _id: Number(orderFromWs._id),
      number: orderFromWs.number,
      name: orderFromWs.name,
      status: orderFromWs.status,
      createdAt: orderFromWs.createdAt,
      ingredients: orderFromWs.ingredients
        .map(id => allIngredients.find(ing => ing._id === id))
        .filter(Boolean) as TIngredientProps[],
    }
    : undefined;

  const profileOrder: TOrder | undefined = profileOrderFromWs
    ? {
      _id: Number(profileOrderFromWs._id),
      number: profileOrderFromWs.number,
      name: profileOrderFromWs.name,
      status: profileOrderFromWs.status,
      createdAt: profileOrderFromWs.createdAt,
      ingredients: profileOrderFromWs.ingredients
        .map(id => allIngredients.find(ing => ing._id === id))
        .filter(Boolean) as TIngredientProps[],
    }
    : undefined;



  return (
    <>
      <AppHeader className={styles.wrapper} />

      <Routes location={location}>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Protected component={<ProfileLayout />} />}>
          <Route index element={<ProfilePage />} />
          <Route path='orders' element={<Protected component={<ProfileOrders />} />} />
          <Route path='orders/:id' element={<Protected component={<ProfileOrders />} />} />
        </Route>

        <Route path='/register' element={<Protected onlyUnAuth component={<Register />} />} />
        <Route path='/login' element={<Protected onlyUnAuth component={<Login />} />} />
        <Route path='/reset-password' element={<Protected onlyUnAuth component={<ResetPassword />} />} />
        <Route path='/forgot-password' element={<Protected onlyUnAuth component={<ForgotPassword />} />} />

        <Route path='/ingredients/:ingredientId' element={<IngredientDetails />} />
        <Route path='/feed' element={<FeedPage />} />
        <Route path='/feed/:id' element={<FeedPage />} />
      </Routes>

      {activeBackground && activeIngredientId && (
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

      {activeBackground && activeFeedId && order && (

        <Routes>
          <Route
            path="/feed/:id"
            element={
              <Modal onClose={handleCloseModal} closeStyle="absolute" title=''>
                <OrderModalContent order={order} />
              </Modal>
            }
          />
        </Routes>
      )}

      {activeBackground && activeProfileOrdId && profileOrder && (

        <Routes>
          <Route
            path="/profile/orders/:id"
            element={
              <Modal onClose={handleCloseModal} closeStyle="absolute" title=''>
                <OrderModalContent order={profileOrder} />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;

