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
                    <h1 className='whiteMessage mb-2'>Регистрация</h1>

                    <input
                        type='text'
                        placeholder={'Имя пользователя'}
                        onChange={e => setName(e.target.value)}
                        name={'name'}
                        value={name}
                        className='inputDefault mb-1'
                    />

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
                        Зарегистрироваться
                    </button>

                    <div className='flex flexCenter'>
                        <p><span className='whiteMessage mr-1'>Уже зарегистрированы?</span></p>
                        <Link to='/login' className='link'> Войти</Link>
                    </div>

                </form>
            </div>
        </div>

    );
}