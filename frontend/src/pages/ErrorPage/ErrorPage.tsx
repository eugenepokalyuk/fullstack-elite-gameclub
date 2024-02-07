import { Link } from 'react-router-dom';

import styles from './ErrorPage.module.css';

export const ErrorPage = () => (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className='whiteMessage'>Ой, 404 Ошибка!</h1>
                <p className='mt-2'>Запрошенная вами страница не существует</p>
                <p className='mt-2'>проверьте адрес или попробуйте зайти на<Link to='/' className='link ml-1'>домашнюю страницу</Link></p>
            </div>
        </div>
    </div>
);