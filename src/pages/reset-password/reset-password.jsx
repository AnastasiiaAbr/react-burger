import { useEffect, useState } from 'react';
import styles from './reset-password.module.css';
import { PasswordInput, Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, replace, useNavigate } from 'react-router-dom';
import { request } from '../../utils/request';
import { API } from '../../utils/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const canAccess = localStorage.getItem('RESET_PASSWORD');
    if (!canAccess) {
      navigate('/forgot-password', {replace: true});
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    request(API.PASSWORD_RESET_RESET, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        token: code
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
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Input
            name='code'
            placeholder='Введите код из письма'
            value={code}
            onChange={e => setCode(e.target.value)}
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