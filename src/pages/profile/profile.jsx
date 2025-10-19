import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { Input, PasswordInput, EmailInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { updateUser, logoutUser } from '../../services/user-slice';
import { useForm } from '../../hooks/useForm';


const Profile = () => {
  const { user } = useSelector(state => state.user);
  const { values: form, handleChange, setValues } = useForm({
    name: '',
    email: '',
    password: ''
  });
  const [isChanged, setIsChanged] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        password: ''
      })
    }
  }, [user]);

  const handleInputChange = (e) => {
    handleChange(e);
    setIsChanged(true);
  }

  const handleCancel = () => {
    setValues({
      name: user.name || '',
      email: user.email || '',
      password: ''
    });
    setIsChanged(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(form));
    setIsChanged(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate('/login', { replace: true }));
  };

  return (
    <>
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder="Имя"
            value={form.name}
            icon="EditIcon"
            onChange={handleInputChange}
          />
          <EmailInput
            name="email"
            value={form.email}
            icon='EditIcon'
            onChange={handleInputChange}
          />
          <PasswordInput
            name="password"
            value={form.password}
            icon='EditIcon'
            onChange={handleInputChange}
          />

          {isChanged && (
            <div className={styles.changeContainer}>
              <p onClick={handleCancel} className={`${styles.cancelText} text text_type_main-default`}>Отмена</p>
              <Button htmlType='submit' type='primary' size='medium'>Сохранить</Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default Profile;
