import React from "react";
import PropTypes from 'prop-types';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css'

const HeaderItem = ({ icon: IconComponent, text, active = false }) => {
  return (
    <div className={`mt-4 mb-4 pl-5 pr-5' ${styles.iconWrapper}`}>
      <IconComponent type={active ? "primary" : "secondary"} />
      <span className={`text text_type_main-small ml-2 ${active ? "text_color_primary" : "text_color_inactive"}`}>
        {text}
      </span>
    </div>
  );
};

const AppHeader = () => {
  return (
    <header>
    <nav className={styles.nav}>
        <div className={styles.left}>
          <HeaderItem icon={BurgerIcon} text='Конструктор' active extraClass='mr-2' />
          <HeaderItem icon={ListIcon} text='Лента заказов' />
        </div>

        <Logo className="mt-4 mb-4" />

        <div className={styles.right}>
          <HeaderItem icon={ProfileIcon} text='Личный кабинет' />
          </div>
    </nav>
    </header>
  )
}

HeaderItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool
}


export default AppHeader;