import styles from './AppHeader.module.css';
import { NavLink, useMatch } from 'react-router-dom';
import { DEFAULT_PATH, SETTINGS_PATH, STORE_PATH, STAT_PATH, WAREHOUSE_PATH, PROFILE_PATH, STAT_SESSION_PATH } from '../../utils/routePath';

const AppHeader = () => {
    const homeRoute = useMatch(DEFAULT_PATH);
    const settingsRoute = useMatch(SETTINGS_PATH);
    const storeRoute = useMatch(STORE_PATH);
    const warehouseRoute = useMatch(WAREHOUSE_PATH);
    const statRoute = useMatch(STAT_PATH);
    const statSessionRoute = useMatch(STAT_SESSION_PATH);
    const profileRoute = useMatch(PROFILE_PATH);

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.linksContainer}>
                    <NavLink to="/" className={`whiteMessage ml-2 mr-2 ${homeRoute ? styles.linkActive : 'whiteMessage'}`}>
                        Главная
                    </NavLink>

                    <NavLink to="/store" className={`whiteMessage ml-2 mr-2 ${storeRoute ? styles.linkActive : 'whiteMessage'}`}>
                        Магазин
                    </NavLink>

                    <NavLink to="/warehouse" className={`whiteMessage ml-2 mr-2 ${warehouseRoute ? styles.linkActive : 'whiteMessage'}`}>
                        Склад
                    </NavLink>

                    <NavLink to="/stat-session" className={`whiteMessage ml-2 mr-2 ${statSessionRoute ? styles.linkActive : 'whiteMessage'}`}>
                        Смена
                    </NavLink>

                    <NavLink to="/stat" className={`whiteMessage ml-2 mr-2 ${statRoute ? styles.linkActive : 'whiteMessage'}`}>
                        Статистика
                    </NavLink>

                    <NavLink to="/settings" className={`whiteMessage ml-2 mr-2 ${settingsRoute ? styles.linkActive : 'whiteMessage'}`}>
                        Настройки
                    </NavLink>
                </div>

                <div className='flex mr-2'>
                    <NavLink to="/profile" className={`whiteMessage ml-2 mr-2 ${profileRoute ? styles.linkActive : 'whiteMessage'}`}>
                        Профиль
                    </NavLink>
                </div>

            </nav>
        </header>
    );
}

export default AppHeader;