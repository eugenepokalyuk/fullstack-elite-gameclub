import { Link } from 'react-router-dom';

import styles from './ErrorPage.module.css';

export const ErrorPage = () => (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={`${styles.warningText} text text_type_main-large mb-5 mt-10`}>Ой, 404 Ошибка!</h1>
                <p className='text text_type_main-medium mb-4'>Запрошенная вами страница не существует</p>
                <p className='text text_type_main-medium'>проверьте адрес или попробуйте зайти на<Link to='/' className={`${styles.link} ml-2`}>домашнюю страницу</Link></p>
            </div>
        </div>
    </div>
);