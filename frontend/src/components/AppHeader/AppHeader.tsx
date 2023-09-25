import React from 'react';
import styles from './AppHeader.module.css';
import image from '../../images/logo.jpeg'
const AppHeader = () => {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.imageContainer}>
                    <img src={image} alt="elite logo" />
                </div>
                <h1>Привет, Админ!</h1>
            </nav>
        </header>
    );
}

export default AppHeader;