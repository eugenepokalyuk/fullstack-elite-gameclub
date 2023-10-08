import React from 'react';
import styles from './AppHeader.module.css';
import image from '../../images/logo.jpeg'
import { NavLink, useMatch } from 'react-router-dom';
import { DEFAULT_PATH, SETTINGS_PATH, STORE_PATH, STAT_PATH, WAREHOUSE_PATH } from '../../utils/routePath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const AppHeader = () => {
    const homeRoute = useMatch(DEFAULT_PATH);
    const settingsRoute = useMatch(SETTINGS_PATH);
    const storeRoute = useMatch(STORE_PATH);
    const warehouseRoute = useMatch(WAREHOUSE_PATH);
    const statRoute = useMatch(STAT_PATH);

    // const link = ({ isActive }: { isActive: boolean }) =>
    // isActive ? `${styles.link} text_color_primary` : `${styles.link}`;

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>

                <div className={styles.imageContainer}>
                    <NavLink to="/">
                        <img src={image} alt="elite logo" />
                    </NavLink>
                </div>

                <div className={styles.linksContainer}>
                    <NavLink to="/" className={`${styles.link} ${homeRoute ? styles.linkActive : styles.link}`}>
                        Главная
                    </NavLink>

                    <NavLink to="/store" className={`${styles.link} ${storeRoute ? styles.linkActive : styles.link}`}>
                        Магазин
                    </NavLink>

                    <NavLink to="/warehouse" className={`${styles.link} ${warehouseRoute ? styles.linkActive : styles.link}`}>
                        Склад
                    </NavLink>

                    <NavLink to="/stat" className={`${styles.link} ${statRoute ? styles.linkActive : styles.link}`}>
                        Статистика
                    </NavLink>

                    <NavLink to="/settings" className={`${styles.link} ${settingsRoute ? styles.linkActive : styles.link}`}>
                        Настройки
                    </NavLink>
                </div>

                <div className={styles.imageContainer}>
                    <NavLink to="/login">
                        <FontAwesomeIcon icon={faUser} size="2x" className={styles.user} />
                    </NavLink>
                </div>

            </nav>
        </header>
    );
}

export default AppHeader;