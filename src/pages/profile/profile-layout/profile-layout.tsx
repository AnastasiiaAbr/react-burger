import styles from './profile-layout.module.css';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../services//slices/user-slice';
import { useAppDispatch } from '../../../services/store';

export const ProfileLayout = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    dispatch(logoutUser()).then(() => navigate('/login', { replace: true }));
  };

  return (
      <div className={styles.container}>
        <nav className={styles.menu}>
          <NavLink
            to='/profile'
            end
            className={({ isActive }) => `${styles.link} text text_type_main-medium ${isActive ? styles.link_active : 'text_color_inactive'}`}>
            Профиль
          </NavLink>

          <NavLink
            to='/profile/orders'
            end
            className={({ isActive }) => `${styles.link} text text_type_main-medium ${isActive ? styles.link_active : 'text_color_inactive'}`}>
            История заказов
          </NavLink>

          <button
            onClick={handleLogout}
            className={`${styles.logout} ${styles.link} text text_type_main-medium text_color_inactive`}>
            Выход
          </button>
          <p className={`${styles.text} text text_type_main-default text_color_inactive`}>
            В этом разделе вы можете изменить свои персональные данные
          </p>
        </nav>

        <Outlet />
        </div>
      )
}