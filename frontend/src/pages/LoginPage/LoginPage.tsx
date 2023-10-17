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
                dispatch({ type: 'REGISTER_FAILURE' });
                setError('Ой, произошла ошибка!');
            });
    };

    return (
        <section className={styles.wrapper}>
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.content}>
                    <h1 className='whiteMessage mb-2'>Вход</h1>

                    <input
                        type='text'
                        placeholder={'Логин'}
                        onChange={e => setLogin(e.target.value)}
                        name={'login'}
                        value={login}
                        className='inputDefault mb-1'
                    />

                    <input
                        type='password'
                        placeholder={'Пароль'}
                        onChange={e => setPassword(e.target.value)}
                        name={'password'}
                        value={password}
                        className='inputDefault mb-1'
                    />

                    {error && (
                        <p className="errorMessage mt-1 mb-1">
                            {error}
                        </p>
                    )}

                    <button className={`buttonDefault mb-2`}>
                        Начать смену
                    </button>

                    <div className='flex flexCenter'>
                        <p><span className='whiteMessage mr-1'>Вы - новый пользователь? </span></p>
                        <Link to='/register' className='link'> Зарегистрироваться</Link>
                    </div>
                </form>
            </div>
        </section>
    );
}