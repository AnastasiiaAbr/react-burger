import { useEffect, useState } from 'react';
import styles from './reset-password.module.css';
import { PasswordInput, Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../../utils/request';
import { API } from '../../utils/api';
import { useForm } from '../../hooks/useForm';

const ResetPassword = (): React.JSX.Element => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {values, handleChange} = useForm({
    password: '',
    code: ''
  })

  useEffect(() => {
    const canAccess = localStorage.getItem('RESET_PASSWORD');
    if (!canAccess) {
      navigate('/forgot-password', {replace: true});
    }
  }, [navigate])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    type TResetRequest = {
      success: boolean;
      message?: string;
    }

    request<TResetRequest>(API.PASSWORD_RESET_RESET, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: values.password,
        token: values.code
      })
    })
      .then(data => {
        if (data.success) {
          alert(data.message || "Пароль успешно изменён");
          localStorage.removeItem('RESET_PASSWORD');
          navigate('/login', { replace: true });
        } else {
          alert(data.message || "Не удалось изменить пароль");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Произошла ошибка. Попробуйте снова");
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <div className={styles.container}>
        <p className="text text_type_main-medium">Восстановление пароля</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <PasswordInput
            name='password'
            placeholder="Введите новый пароль"
            value={values.password}
            onChange={handleChange}
          />
          <Input
            name='code'
            placeholder='Введите код из письма'
            value={values.code}
            onChange={handleChange}
            {...({} as any)}
          />
          <Button htmlType="submit" type="primary" size='medium'>Сохранить</Button>
          <p className={`text text_type_main-default text_color_inactive ${styles.text}`}>Вспомнили пароль?
            <Link to='/login'> Войти</Link></p>
        </form>
      </div>
    </>
  )
}

export default ResetPassword;