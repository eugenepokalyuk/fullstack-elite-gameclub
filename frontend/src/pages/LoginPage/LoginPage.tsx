import React, { useState, FormEvent, FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks/hooks';

import styles from './LoginPage.module.css';
import { fetchStatSessionData, fetchUserLogin } from '../../utils/api';
import { USER_STATEMENT } from '../../services/actions/auth'
import Modal from '../../components/Modal/Modal';

export const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [isModalRead, setModalRead] = useState(false); // State for modal visibility
    const [response, setResponse] = useState<any>(); // State for modal visibility
    const [error, setError] = useState('');

    const [cashout, setCashout] = useState<number>();

    const closeModal = () => {
        navigate(-1);
    };

    const handleSubmitModal = () => {
        setModalRead(true)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchUserLogin(login, password)
            .then(res => {
                if (res.success) {
                    setCashout(res.cashout);
                    setShowModal(true);
                    setResponse(res);
                } else {
                    setError('Ой, данные для входа неверные!');
                }
            })
            .catch(error => {
                dispatch({ type: 'REGISTER_FAILURE' });
                setError('Ой, произошла ошибка!');
            });
    };

    useEffect(() => {
        if (response) {
            localStorage.setItem('uuid', response.uuid);
            localStorage.setItem('sessionId', response.sessionId);

            dispatch({
                type: USER_STATEMENT,
                payload: {
                    uuid: response.uuid,
                    name: response.name,
                    sessionId: response.sessionId,
                    login,
                    password
                }
            })

            navigate('/', { replace: true });
        }
    }, [isModalRead])

    return (
        <>
            {showModal && (
                <Modal onClose={closeModal} header="Касса новой смены">
                    <div className='flex flex-col flexCenter'>
                        <h1 className='whiteMessage'>Привет! Сверь кассу</h1>
                        <h1 className='whiteMessage'>Касса: {cashout}  руб.</h1>

                        <button className={`buttonDefault mt-2`} onClick={handleSubmitModal}>
                            Ознакомился
                        </button>
                    </div>
                </Modal>
            )}
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
        </>
    );
}