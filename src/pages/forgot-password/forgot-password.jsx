import React from "react";
import styles from './forgot-password.module.css';
import { EmailInput, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../utils/api";
import { request } from "../../utils/request";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    request(API.PASSWORD_RESET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      .then((data) => {
      if (data.success) {
        localStorage.setItem('RESET_PASSWORD', true);
        navigate('/reset-password', { replace: true });
      } else {
        alert(data.message || "Не удалось отправить письмо");
      }
    }) 
    .catch ((err) =>  {
      console.error(err);
      alert('Произошла ошибка. Попробуйте еще раз');
    }) 
     .finally (() => setLoading(false));
  };


  return (
    <>
      <div className={styles.container}>
        <p className="text text_type_main-medium">Восстановление пароля</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <EmailInput
            name='email'
            placeholder="Укажите e-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button htmlType="submit" type="primary" size='medium' disabled={loading}>Восстановить</Button>
          <p className={`text text_type_main-default text_color_inactive ${styles.text}`}>Вспомнили пароль?
            <Link to='/login'> Войти</Link></p>
        </form>
      </div>
    </>
  )
};

export default ForgotPassword;