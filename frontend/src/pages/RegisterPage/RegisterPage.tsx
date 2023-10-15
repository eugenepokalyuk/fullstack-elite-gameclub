import React, { useState, FormEvent, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { fetchUserRegister, fetchUserLogin } from '../../utils/api';
import { USER_STATEMENT } from '../../services/actions/auth'
import { useAppDispatch } from '../../services/hooks/hooks';

export const RegisterPage: FC = () => {
    const dispatch = useAppDispatch();

    const [name, setName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchUserRegister(name, login, password)
            .then(res => {
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
                        setError('Ой, произошла ошибка!');
                    });
            })
            .catch(error => {
                setError('Ой, произошла ошибка!');
            });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.content}>
                    <h1 className={`${styles.colorWhite}`}>Регистрация</h1>

                    <input
                        type='text'
                        placeholder={'Имя пользователя'}
                        onChange={e => setName(e.target.value)}
                        name={'name'}
                        value={name}
                        className={`${styles.inputDefault} ${styles.inputLogin} mb-6`}
                    />

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
                        <p className={`${styles.errorMessage} text text_type_main-default mb-4`} >
                            {error}
                        </p>
                    )}

                    <button className={`${styles.buttonDefault} ${styles.mb2}`}>
                        Зарегистрироваться
                    </button>

                    <div>
                        <span className={`${styles.colorWhite}`}>Уже зарегистрированы?</span>
                        <Link to='/login' className={styles.link}> Войти</Link>
                    </div>

                </form>
            </div>
        </div>

    );
}