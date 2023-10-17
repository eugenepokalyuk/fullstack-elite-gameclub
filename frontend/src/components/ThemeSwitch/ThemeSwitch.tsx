import React, { FC } from 'react';
import { useTheme } from '../../services/hooks/useTheme';
import styles from "./ThemeSwitch.module.css";
import { useAppDispatch } from '../../services/hooks/hooks';

export const ThemeSwitch: FC = () => {
    const dispatch = useAppDispatch();

    const { theme, setTheme } = useTheme();
    const handleSetDarkThemeClick = () => {
        setTheme('dark');
    }
    const handleSetLightThemeClick = () => {
        setTheme('light');
    }
    return (
        <div className={`${styles.themeContainer} p-1 mt-1 mb-1`}>
            <button className={`${styles.themeButton} ${styles.themeLight} mr-1 p-1`} onClick={handleSetLightThemeClick}>Teal</button>
            <button className={`${styles.themeButton} ${styles.themeDark} p-1`} onClick={handleSetDarkThemeClick}>Orange</button>
        </div>
    );
};