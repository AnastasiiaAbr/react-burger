import React from "react";
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css'
import { NavLink } from "react-router-dom";

type TAppHeaderProps = {
  className?: string;
}

const AppHeader = ({ className }: TAppHeaderProps): React.JSX.Element => {
  return (
    <header>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <NavLink to='/'
            className={({ isActive }: { isActive: boolean }): string =>
              `mt-4 mb-4 pl-5 pr-5 ${styles.iconWrapper} ${isActive ? styles.link_active : styles.link}`
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className={`text text_type_main-small ml-2 ${isActive ? "text_color_primary" : "text_color_inactive"}`}>
                  Конструктор
                </span>
              </>
            )}
          </NavLink>
          <NavLink to='/feed'
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

        <NavLink to="/">
          <Logo className="mt-4 mb-4" />
        </NavLink>

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