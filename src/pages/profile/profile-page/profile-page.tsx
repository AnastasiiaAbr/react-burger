import React, { useEffect, useState } from 'react';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useSelector } from '../../../services/store';
import { updateUser } from '../../../services//slices/user-slice';
import { useForm } from '../../../hooks/useForm';
import styles from './profile-page.module.css'


const ProfilePage = (): React.JSX.Element => {
  const { user } = useSelector(state => state.user);
  const { values: form, handleChange, setValues } = useForm({
    name: '',
    email: '',
    password: ''
  });
  const [isChanged, setIsChanged] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        password: ''
      })
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    handleChange(e as React.ChangeEvent<HTMLInputElement>);
    setIsChanged(true);
  }

  const handleCancel = (): void => {
    if (user) {
    setValues({
      name: user.name || '',
      email: user.email || '',
      password: ''
    });
  }
    setIsChanged(false);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(updateUser(form));
    setIsChanged(false);
  };

  return (
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder="Имя"
            value={form.name}
            icon="EditIcon"
            onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
            {...({} as any)}
          />
          <Input
            name="email"
            value={form.email}
            icon='EditIcon'
            onChange={handleInputChange}
            {...({} as any)}
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
  );
}

export default ProfilePage;
