import React, { FC, useEffect } from 'react';
import styles from "./Clock.module.css"
export const Clock: FC = () => {
    // const time = new Date().toLocaleString()
    // const time = new Date().toLocaleString()

    const [dateTime, setDateTime] = React.useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');

            const updatedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            setDateTime(updatedDateTime);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={`${styles.textShadows} ${styles.mb4} text text_type_main-large`}>{dateTime}</h1>
        </div>
    )
};