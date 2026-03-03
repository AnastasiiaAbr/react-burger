import React, { useEffect, useState } from 'react';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  MenuIcon,
  CloseIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';
import useMediaQuery from '../../hooks/useMedia';
import styles from './app-header.module.css';
import logo from '../../img/logo.png';
import { logoutUser } from '../../services/slices/user-slice';
import { useAppDispatch } from '../../services/store';


type TAppHeaderProps = {
  className?: string;
};

const AppHeader = ({ className }: TAppHeaderProps): React.JSX.Element => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen((prev) => !prev);
    setActiveMobileItem('logout');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleProfileMenu = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    setProfileOpen(prev => !prev);
  };

  const handleProfileClick = () => {
    toggleProfileMenu();
    setActiveMobileItem('profile');
  };

  const handleMobileNavClick = (key: string) => {
    setActiveMobileItem(key);
    toggleMenu();
  };

  const isProfileActive =
  activeMobileItem === 'profile' ||
  activeMobileItem === 'orders';


  useEffect(() => {
    if (location.pathname === '/profile/orders') {
      setActiveMobileItem('orders');
    } else if (location.pathname.startsWith('/profile')) {
      setActiveMobileItem('profile');
    } else if (location.pathname === '/feed') {
      setActiveMobileItem('feed')
    } else{
      setActiveMobileItem('constructor');
    }
  }, [location.pathname]);

  return (
    <header className={styles.header}>
      {isMobile ? (
        <div className={styles.headerSmall}>
          {!menuOpen ? (
            <>
              <img src={logo} alt="logo-small" />
              <MenuIcon type="primary" onClick={toggleMenu} />
            </>
          ) : (
            <>
              <span className={`text text_type_main-large ${styles.menuTitle}`}>Меню</span>
              <CloseIcon type="primary" onClick={toggleMenu} />
            </>
          )}

          {menuOpen && (
            <nav className={styles.mobileMenu}>
              <NavLink to="/" end onClick={() => handleMobileNavClick('constructor')}>
                <div className={`${styles.navLink} text text_type_main-medium`}>
                  <BurgerIcon type={activeMobileItem === 'constructor' ? 'primary' : 'secondary'} />
                  <span className={activeMobileItem === 'constructor' ? `${styles.activeLink}` : `${styles.defaultLink}`}>Конструктор</span>
                </div>
              </NavLink>

              <NavLink to="/feed" end onClick={() => handleMobileNavClick('feed')}>
                <div className={`${styles.navLink} text text_type_main-medium`}>
                  <ListIcon type={activeMobileItem === 'feed' ? 'primary' : "secondary"} />
                  <span className={activeMobileItem === 'feed' ? `${styles.activeLink}` : `${styles.defaultLink}`}>Лента заказов</span>
                </div>
              </NavLink>

              <div className={`${styles.navProfile} text text_type_main-medium`}>
                <div className={styles.profileRow}>
                  <div
                    onClick={handleProfileClick}
                    className={styles.profileLink}
                  >
                    <ProfileIcon type={isProfileActive ? "primary" : "secondary"} />
                    <span className={isProfileActive ? styles.activeLink : styles.defaultLink}>
                      Личный кабинет
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.arrowButton}
                    onClick={toggleProfileMenu}
                  >
                    {profileOpen ? (
                      <ArrowUpIcon type='secondary' />
                    ) : (
                      <ArrowDownIcon type='primary' />
                    )}
                  </button>
                </div>

                {profileOpen && (
                  <div className={styles.profileDropdown}>
                    <NavLink to='/profile' onClick={() => handleMobileNavClick('profile')}
                      className={
                        activeMobileItem === 'profile'
                          ? `${styles.profileList} ${styles.activeLink}`
                          : styles.profileList
                      }>Профиль</NavLink>
                    <NavLink to='/profile/orders' onClick={() => handleMobileNavClick('orders')}
                      className={
                        activeMobileItem === 'orders'
                          ? `${styles.profileList} ${styles.activeLink}`
                          : styles.profileList
                      }>История заказов</NavLink>
                    <NavLink to='/login' onClick={handleLogout} className={styles.profileList}>Выход</NavLink>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      ) : (
        <nav className={styles.nav}>
          <div className={styles.left}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `mt-4 mb-4 pl-5 pr-5 ${styles.iconWrapper} ${isActive ? styles.link_active : styles.link
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <BurgerIcon
                    type={isActive ? 'primary' : 'secondary'}
                  />
                  <span
                    className={`text text_type_main-small ml-2 ${isActive
                      ? 'text_color_primary'
                      : 'text_color_inactive'
                      }`}
                  >
                    Конструктор
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `mt-4 mb-4 pl-5 pr-5 ${styles.iconWrapper} ${isActive ? styles.link_active : styles.link
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ListIcon
                    type={isActive ? 'primary' : 'secondary'}
                  />
                  <span
                    className={`text text_type_main-small ml-2 ${isActive
                      ? 'text_color_primary'
                      : 'text_color_inactive'
                      }`}
                  >
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
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `mt-4 mb-4 pl-5 pr-5 ${styles.iconWrapper} ${isActive ? styles.link_active : styles.link
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ProfileIcon
                    type={isActive ? 'primary' : 'secondary'}
                  />
                  <span
                    className={`text text_type_main-small ml-2 ${isActive
                      ? 'text_color_primary'
                      : 'text_color_inactive'
                      }`}
                  >
                    Личный кабинет
                  </span>
                </>
              )}
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
};

export default AppHeader;
