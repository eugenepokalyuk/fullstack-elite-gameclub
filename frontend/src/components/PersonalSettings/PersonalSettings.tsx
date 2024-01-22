import React, { FC } from 'react';
import styles from "./PersonalSettings.module.css";
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';

export const PersonalSettings: FC = () => {
    const themeColor = {
        theme: "#1c1c21",
        mainColor: "var(--main-color)"
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
            <h3 className='whiteMessage'>Персональные изменения</h3>
            <ul>
                <li className='mt-1'>
                    <p>Тема на выбор:</p>
                    <ThemeSwitch />
                </li>
            </ul>
        </>
    );
};