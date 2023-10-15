import React, { FC } from 'react';
import styles from "./PersonalSettings.module.css";
import { useAppDispatch } from '../../services/hooks/hooks';

export const PersonalSettings: FC = () => {
    const dispatch = useAppDispatch();

    const themeColor = {
        theme: "#1c1c21",
        mainColor: "#ef7912"
    }

    const styleMainColor = {
        marginLeft: "1vh",
        width: "4vh",
        height: "4vh",
        background: themeColor.mainColor
    }

    const styleMainTheme = {
        marginLeft: "1vh",
        width: "4vh",
        height: "4vh",
        background: themeColor.theme
    }

    return (
        <>
            <h3>Персональные изменения</h3>
            <ul>
                <li className={styles.flex}>
                    <p>Основной цвет:</p>
                    <div style={styleMainColor}></div>
                </li>

                <li className={styles.flex}>
                    <p>Тема:</p>
                    <div style={styleMainTheme}></div>
                </li>
            </ul>
        </>
    );
};