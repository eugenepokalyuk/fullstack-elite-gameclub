import React from 'react';
import styles from './AppHeader.module.css';
import image from '../../images/logo.jpeg'
import { NavLink, useMatch } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const AppHeader = () => {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.imageContainer}>
                    <img src={image} alt="elite logo" />
                </div>

                <div className={styles.linksContainer}>
                    <NavLink to="/" className={styles.link}>
                        Главная
                    </NavLink>

                    <NavLink to="/settings" className={styles.link}>
                        Настройки
                    </NavLink>
                </div>

                <FontAwesomeIcon icon={faUser} size="2x" className={styles.user}/>
            </nav>
        </header>
    );
}

export default AppHeader;