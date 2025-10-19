import React from "react";
import PropTypes from 'prop-types';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css'
import { NavLink } from "react-router-dom";

const AppHeader = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <NavLink to='/'
            className={({ isActive }) =>
              `mt-4 mb-4 pl-5 pr-5 ${styles.iconWrapper} ${isActive ? styles.link_active : styles.link}`
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-small ml-2 ${isActive ? "text_color_primary" : "text_color_inactive"}`}>
                  Конструктор
                </span>
              </>
            )}
          </NavLink>
          <NavLink to='/list'
            className={({ isActive }) =>
              `mt-4 mb-4 pl-5 pr-5 ${styles.iconWrapper} ${isActive ? styles.link_active : styles.link}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-small ml-2 ${isActive ? "text_color_primary" : "text_color_inactive"}`}>
                  Лента заказов
                </span>
              </>
            )}
          </NavLink>
        </div>

        <Logo className="mt-4 mb-4" />

        <div className={styles.right}>
          <NavLink to='/profile'
            className={({ isActive }) =>
              `mt-4 mb-4 pl-5 pr-5 ${styles.iconWrapper} ${isActive ? styles.link_active : styles.link}`
            }
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-small ml-2 ${isActive ? "text_color_primary" : "text_color_inactive"}`}>
                  Личный кабинет
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}


export default AppHeader;