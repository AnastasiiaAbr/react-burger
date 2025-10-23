import React from "react";
import styles from './forgot-password.module.css';
import { EmailInput, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../utils/api";
import { request } from "../../utils/request";
import { useForm } from "../../hooks/useForm";

const ForgotPassword = (): React.JSX.Element => {
  const { values, handleChange } = useForm({ email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    type TForgotResponse = {
      success: boolean;
      message?: string;
    } 

    request<TForgotResponse>(API.PASSWORD_RESET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: values.email })
    })

      .then((data) => {
        if (data.success) {
          localStorage.setItem('RESET_PASSWORD', 'true');
          navigate('/reset-password', { replace: true });
        } else {
          alert(data.message || "Не удалось отправить письмо");
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Произошла ошибка. Попробуйте еще раз');
      })
      .finally(() => setLoading(false));
  };


  return (
    <>
      <div className={styles.container}>
        <p className="text text_type_main-medium">Восстановление пароля</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <EmailInput
            name='email'
            placeholder="Укажите e-mail"
            value={values.email}
            onChange={handleChange}
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