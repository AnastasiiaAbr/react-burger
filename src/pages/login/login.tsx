import React from "react";
import styles from './login.module.css';
import { EmailInput, Button, PasswordInput } from "@ya.praktikum/react-developer-burger-ui-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { loginUser } from "../../services/user-slice";
import { checkUserAuth } from "../../services/user-slice";
import { useForm } from "../../hooks/useForm";

const Login = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {values, handleChange} = useForm({
    email: '',
    password: ''
  });

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const result = await dispatch(loginUser({ email: values.email, password: values.password }));

  if (loginUser.fulfilled.match(result)) {
    await dispatch(checkUserAuth());

    const from = location.state?.from || '/profile';
    navigate(from, {replace: true});
  } else {
    alert('Ошибка входа, проверьте данные')
  }
};


  return (
    <>
      <div className={styles.container}>
        <p className="text text_type_main-medium">Вход</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <EmailInput
            name='email'
            value={values.email}
            onChange={handleChange}
          />
          <div className={styles.passwordInput}>
          <PasswordInput
            name='password'
            value={values.password}
            onChange={handleChange}
          />
          </div>
          <Button htmlType="submit" type="primary" size='medium'>Войти</Button>
          <p className={`text text_type_main-default text_color_inactive ${styles.text}`}>
            Вы новый пользователь? 
             <Link to="/register"> Зарегистрироваться</Link>
          </p>

          <p className="text text_type_main-default text_color_inactive">Забыли пароль?
             <Link to='/forgot-password'> Восстановить пароль</Link></p>
        </form>
      </div>
    </>
  )
};

export default Login;