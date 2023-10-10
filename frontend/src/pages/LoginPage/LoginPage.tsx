import React, { useState, FormEvent, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch } from '../../services/hooks/hooks';

import styles from './LoginPage.module.css';
import { fetchUserLogin } from '../../utils/api';
import { USER_STATEMENT } from '../../services/actions/auth'

export const LoginPage: FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchUserLogin(login, password)
            .then(res => {
                if (res.success) {
                    localStorage.setItem('uuid', res.uuid);
                    localStorage.setItem('sessionId', res.sessionId);

                    dispatch({
                        type: USER_STATEMENT,
                        payload: {
                            uuid: res.uuid,
                            name: res.name,
                            sessionId: res.sessionId,
                            login,
                            password
                        }
                    })
                    navigate('/', { replace: true });
                } else {
                    setError('Ой, данные для входа неверные!');
                }
            })
            .catch(error => {
                // dispatch({ type: 'REGISTER_FAILURE' });
                setError('Ой, произошла ошибка!');
            });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.content}>
                    <h1 className='text text_type_main-medium mb-6 mt-10'>Вход</h1>

                    <input
                        type='text'
                        placeholder={'Логин'}
                        onChange={e => setLogin(e.target.value)}
                        name={'login'}
                        value={login}
                        className={`${styles.inputDefault} ${styles.inputLogin} mb-6`}
                    />

                    <input
                        type='password'
                        placeholder={'Пароль'}
                        onChange={e => setPassword(e.target.value)}
                        name={'password'}
                        value={password}
                        className={`${styles.inputDefault} ${styles.inputPwd} mb-6`}
                    />

                    {error && (
                        <p className={`${styles.errorMessage} text text_type_main-default mb-4`}>
                            {error}
                        </p>
                    )}

                    <button className={`${styles.buttonDefault} mb-20`}>
                        Начать смену
                    </button>


                    <div className='text text_type_main-small mb-4'>
                        <span className="text_color_inactive">Вы - новый пользователь? </span>
                        <Link to='/register' className={styles.link}> Зарегистрироваться</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}