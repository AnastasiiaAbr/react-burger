import styles from './register.module.css';
import { EmailInput, Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../services/user-slice';
import { useForm } from '../../hooks/useForm';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, handleChange} = useForm({
    name: '',
    password: '',
    email: ''
  }) 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registerUser({ email: values.email, password: values.password, name: values.name}));

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
        value={values.name}
        onChange={handleChange}
        />
        <EmailInput
        name='email'
        value={values.email}
        onChange={handleChange}
        />
        <PasswordInput 
        name='password'
        value={values.password}
        onChange={handleChange}
        />
        <Button htmlType='submit' type='primary' size='medium'>Зарегистрироваться</Button>
        <p className={`text text_type_main-default text_color_inactive ${styles.text}`}>Уже зарегистрированы? <Link to='/login'> Войти</Link> </p>
      </form>
    </div>
    </>
  )
}

export default Register;