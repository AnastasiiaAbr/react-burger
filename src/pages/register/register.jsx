import styles from './register.module.css';
import { EmailInput, Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../services/user-slice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registerUser({ email, password, name}));

    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    } else {
      alert ("Ошибка регистрации")
    }
  }

  return (
    <>
    <div className={styles.container}>
      <p className="text text_type_main-medium">Регистрация</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
        name='name'
        placeholder='Имя'
        value={name}
        onChange={e => setName(e.target.value)}
        />
        <EmailInput
        name='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        />
        <PasswordInput 
        name='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        />
        <Button htmlType='submit' type='primary' size='medium'>Зарегистрироваться</Button>
        <p className={`text text_type_main-default text_color_inactive ${styles.text}`}>Уже зарегистрированы? <Link to='/login'> Войти</Link> </p>
      </form>
    </div>
    </>
  )
}

export default Register;