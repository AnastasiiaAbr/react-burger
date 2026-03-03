import React from "react";
import styles from './login.module.css';
import { EmailInput, Button, PasswordInput } from "@ya.praktikum/react-developer-burger-ui-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/slices/user-slice";
import { checkUserAuth } from "../../services/slices/user-slice";
import { useForm } from "../../hooks/useForm";
import { useAppDispatch } from "../../services/store";
import useMediaQuery from "../../hooks/useMedia";

const Login = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email: values.email, password: values.password }));

    if (loginUser.fulfilled.match(result)) {
      await dispatch(checkUserAuth());

      const from = location.state?.from || '/profile';
      navigate(from, { replace: true });
    } else {
      alert('Ошибка входа, проверьте данные')
    }
  };


  return (
    <>
      <div className={styles.container}>
        <p className={`text ${isMobile ? 'text_type_main-large' : 'text_type_main-medium'
          }`}>Вход</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
          <EmailInput
            name='email'
            value={values.email}
            onChange={handleChange}
          />
          </div>
          <div className={styles.passwordInput}>
            <PasswordInput
              name='password'
              value={values.password}
              onChange={handleChange}
              size={isMobile ? 'small' : 'default'}
            />
          </div>
          <Button htmlType="submit" type="primary" size={`${isMobile ? 'small' : 'large'}`}>Войти</Button>
          <p className={`text text_type_main-default text_color_inactive ${styles.text}`}>
            Вы новый пользователь?
            <Link to="/register"> Зарегистрироваться</Link>
          </p>

          <p className={`text text_type_main-default text_color_inactive ${isMobile && styles.text}`}>Забыли пароль?
            <Link to='/forgot-password'> Восстановить пароль</Link></p>
        </form>
      </div>
    </>
  )
};

export default Login;