import React, { useState, FormEvent, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
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
                            sessionStorage.setItem('uuid', res.uuid);
                            dispatch({
                                type: USER_STATEMENT,
                                payload: {
                                    uuid: res.uuid,
                                    name,
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
                    <h1 className='text text_type_main-medium mb-6 mt-10'>Регистрация</h1>

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

                    <button className={`${styles.buttonDefault} mb-20`}>
                        Зарегистрироваться
                    </button>

                    <div className='text text_type_main-small mb-4'>
                        <span className="text_color_inactive">Уже зарегистрированы?</span>
                        <Link to='/login' className={styles.link}> Войти</Link>
                    </div>

                </form>
            </div>
        </div>

    );
}