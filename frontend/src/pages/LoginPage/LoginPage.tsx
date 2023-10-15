import React, { useState, FormEvent, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
                    <h1 className={`${styles.colorWhite}`}>Вход</h1>

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
                        <p className={`${styles.errorMessage}`}>
                            {error}
                        </p>
                    )}

                    <button className={`${styles.buttonDefault} ${styles.mb2}`}>
                        Начать смену
                    </button>

                    <div>
                        <span className={`${styles.colorWhite}`}>Вы - новый пользователь? </span>
                        <Link to='/register' className={styles.link}> Зарегистрироваться</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}