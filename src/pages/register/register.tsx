import styles from './register.module.css';
import { EmailInput, Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/user-slice';
import { useForm } from '../../hooks/useForm';
import useMediaQuery from '../../hooks/useMedia';

const Register = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    name: '',
    password: '',
    email: ''
  });
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ email: values.email, password: values.password, name: values.name }));

    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    } else {
      alert("Ошибка регистрации")
    }
  }

  return (
    <>
      <div className={styles.container}>
        <p className={`text ${isMobile ? 'text_type_main-large' : 'text_type_main-medium'
          }`}>Регистрация</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
          <Input
            name='name'
            placeholder='Имя'
            value={values.name}
            onChange={handleChange}
            size={isMobile ? 'small' : 'default'}
            {...({} as any)}
          />
          </div>
          <div className={styles.inputWrapper}>
          <EmailInput
            name='email'
            value={values.email}
            onChange={handleChange}
            size={isMobile ? 'small' : 'default'}
          />
          </div>
          <div className={styles.inputWrapper}>
          <PasswordInput
            name='password'
            value={values.password}
            onChange={handleChange}
            size={isMobile ? 'small' : 'default'}
          />
          </div>
          <Button htmlType='submit' type='primary' size={`${isMobile ? 'small' : 'large'}`}>Зарегистрироваться</Button>
          <p className={`text text_type_main-default text_color_inactive ${styles.text}`}>Уже зарегистрированы? <Link to='/login'> Войти</Link> </p>
        </form>
      </div>
    </>
  )
}

export default Register;