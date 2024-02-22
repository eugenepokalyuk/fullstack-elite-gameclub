import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../services/actions/auth';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { TComputerStat, TStoreStat, TUser } from '../../services/types/types';
import { fetchAddCashoutData, fetchAddExpenseData, fetchStatSessionData, fetchSubmitPassword, fetchUserFinish } from '../../utils/api';
import { END_SESSION, EXPENSES } from '../../utils/constants';
import Modal from '../Modal/Modal';
import styles from './ProfileDetails.module.css';

const ProfileDetails: FC = () => {
    const user: TUser = useAppSelector((store) => store.auth.user);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [password, setPassword] = useState<string>(''); // New state for password
    const [IsPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);
    const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);

    const [loading, isLoading] = useState<boolean>(false);
    const [modal, isModal] = useState<boolean>(false);
    const [modalStatement, setModalStatement] = useState<string>();
    const [modalHeader, setModalHeader] = useState<string>();

    const [amount, setAmount] = useState<number>(0);
    const [reason, setReason] = useState<string>('');
    const [cashout, setCashout] = useState<number>(0);

    const [error, setError] = useState<boolean>(false);
    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');

    const [storeOrders, setStoreOrders] = useState<TStoreStat[]>();
    const [expenses, setExpenses] = useState<any[]>();
    const [computerOrders, setComputerOrders] = useState<TComputerStat[]>();
    const [cancelOrders, setCancelOrders] = useState<number>();

    const closeModal = () => {
        // navigate(-1);
        isModal(false)
    };

    const handlePassword = () => {
        if (password) {
            // todo: API calls
            fetchSubmitPassword(password)
                .then((res) => {
                    if (res.success) {
                        setIsPasswordCorrect(true);
                        handleGetModal("CASHOUT");
                    } else {
                        setError(true);
                    }
                })
                .catch((error) => {
                    setError(true);
                });
        }
    }
    const calculateComputersTotal = () => {
        const totalSum = computerOrders?.reduce((accumulator, computerOrders) => {
            return accumulator + computerOrders.price
        }, 0);
        return totalSum;
    }
    const calculateStoreTotal = () => {
        const totalSum = storeOrders?.reduce((accumulator, storeOrders) => {
            return accumulator + storeOrders.total
        }, 0);
        return totalSum;
    }
    const calculatePCStore = () => {
        const pc = computerOrders?.reduce(
            (acc, order) => {
                if (order.payment === 'cash') {
                    acc.cash += order.price;
                } else if (order.payment === 'card') {
                    acc.card += order.price;
                }

                if (order.payment) {
                    acc.total += order.price;
                }

                return acc;
            }, {
            cash: 0,
            card: 0,
            total: 0
        });
        const store = storeOrders?.reduce(
            (acc, order) => {
                if (order.payment === 'cash') {
                    acc.cash += order.total;
                } else if (order.payment === 'card') {
                    acc.card += order.total;
                }

                if (order.payment) {
                    acc.total += order.total;
                }

                return acc;
            }, {
            cash: 0,
            card: 0,
            total: 0
        });

        if (pc && store) {
            const sumCash = pc?.cash + store?.cash;
            const sumCard = pc?.card + store?.card;
            const sumTotal = pc?.total + store?.total;

            return {
                cash: sumCash,
                card: sumCard,
                total: sumTotal,
            };
        }
    }
    const handleCashout = () => {
        fetchAddCashoutData(cashout, password)
            .then(res => {
                setFinish(true);
                setFinishDescription("Касса изменена");
            })
            .catch(error => {
                setError(true);
            });
    }
    const handleCloseSession = () => {
        localStorage.clear();
        dispatch(clearUser());
        fetchUserFinish(user.uuid, user.sessionId)
            .then((res) => {
                isLoading(true);
                navigate("/login", { replace: true });
            })
            .catch((error) => {
                setError(true);
            });
    }
    const handleGetModal = (statement: string) => {
        if (statement === EXPENSES) {
            setModalStatement(EXPENSES)
            isModal(true);
            setModalHeader('Внесение расходов');

        }

        if (statement === END_SESSION) {
            handleEndSessionClick();
            setModalStatement(END_SESSION)
            isModal(true);
            setModalHeader('Закрытие смены');
        }

        if (statement === "CASHOUT") {
            setModalStatement("CASHOUT")
            isModal(true);
            setModalHeader('Изменение кассы');
        }

        if (statement === "PASSWORD") {
            setModalStatement("PASSWORD")
            isModal(true);
            setModalHeader('Доступ ограничен, введите пароль:');
        }
    }
    const handlePostExpense = () => {
        fetchAddExpenseData(amount, reason)
            .then(res => {
                setFinish(true);
                setFinishDescription("Расходы внесены");
            })
            .catch(error => {
                setError(true);
            });
    }
    const passwordModalContent = () => {
        return (
            <ul className='flex flexColumn flexCenter'>
                <li className='flex flex-col flexCenter mt-1'>
                    <label htmlFor="password" className='whiteMessage'>Введите пароль:</label>
                    <input type="password" name='password' className='w-80 inputDefault mt-1' placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} />
                </li>
                <li className='mt-2'>
                    <button className='buttonDefault' onClick={handlePassword}>Подтвердить</button>
                </li>
            </ul>
        )
    }
    const handleEndSessionClick = () => {
        fetchStatSessionData()
            .then(res => {
                setStoreOrders(res.storefront);
                setExpenses(res.expenses);
                setComputerOrders(res.devices);
                setCancelOrders(res.canceled);
                setCashout(res.cashout);
            })
            .catch(error => {
                setError(true);
            });
    };
    const endSessionModalContent = () => {
        return (
            <ul className='flex flexColumn flexCenter'>
                <li className='mt-1'>
                    <p className='whiteMessage'>Данные о смене</p>
                </li>

                <ul className={`${styles.cardList} mt-2`}>
                    <li className="w-100 flex flexColumn flexAlignCenter p-2">
                        <p className="whiteMessage">Выручка компютеров: <span className="link">{calculateComputersTotal()}</span> руб.</p>
                        <p className="whiteMessage mt-1">Выручка магазина: <span className="link">{calculateStoreTotal()}</span> руб.</p>
                    </li>

                    <li className="w-100 flex flexColumn flexAlignCenter p-2">
                        <p className="whiteMessage">Наличные: <span className="link">{calculatePCStore()?.cash}</span> руб.</p>
                        <p className="whiteMessage mt-1">Безналичные: <span className="link">{calculatePCStore()?.card}</span> руб.</p>
                    </li>

                    <li className="w-100 flex flexColumn flexCenter flexAlignCenter p-2">
                        <p className="whiteMessage">Общая сумма: <span className="link">{calculatePCStore()?.total}</span> руб.</p>
                    </li>

                    <li className="w-100 flex flexColumn flexCenter flexAlignCenter p-2">
                        <p className="whiteMessage">Касса: <span className="link">{cashout}</span> руб.</p>
                    </li>
                </ul>

                <li className='mt-2'>
                    <button
                        className='buttonDefault'
                        onClick={handleCloseSession}
                    >
                        Подтвердить
                    </button>
                </li>
            </ul>
        )
    }
    const cashoutModalContent = () => {
        return (
            <ul className='flex flexColumn flexCenter'>
                <li className='flex flex-col flexCenter'>
                    <label htmlFor="cashout" className='whiteMessage'>Установить значение кассы:</label>
                    <input type="text" name='cashout' className='w-50 inputDefault mt-1' placeholder={`Значение кассы, руб.`} value={cashout} onChange={(e) => setCashout(Number(e.target.value))} />
                </li>
                <li className='mt-2'>
                    <button className='buttonDefault' onClick={handleCashout}>Подтвердить</button>
                </li>
            </ul>
        )
    }
    const expensesModalContent = () => {
        return (
            <ul className='flex flexColumn flexCenter'>
                <li>
                    <label htmlFor="amount" className='whiteMessage'>Сумма расхода:</label>
                    <input type="text" name='amount' className='inputDefault mt-1' placeholder='Сумма расхода, руб.' value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                </li>

                <li className='mt-1'>
                    <label htmlFor="amount" className='whiteMessage'>Причина:</label>
                    <input type="text" name='reason' className='inputDefault mt-1' placeholder='Причина' value={reason} onChange={(e) => setReason(e.target.value)} />
                </li>

                <li className='mt-1'>
                    <label htmlFor="amount" className='whiteMessage'>Тип оплаты:</label>
                    <input type="text" name='reason' className='inputDefault mt-1' value={'Наличный'} />
                </li>

                <li className='mt-2'>
                    <button className='buttonDefault' onClick={handlePostExpense}>Подтвердить</button>
                </li>
            </ul>
        )
    }
    const statementSwitch = () => {
        if (finish) {
            return (
                <h2 className='whiteMessage'>{finishDescription}</h2>
            )
        }

        if (error) {
            return (
                <>
                    <h2 className='whiteMessage'>Неопознанная Ошибка!</h2>
                    <p className='whiteMessage'>Запиши свои действия и опиши проблеум программисту!</p>
                </>
            )
        }

        switch (modalStatement) {
            case EXPENSES:
                return expensesModalContent();
            case END_SESSION:
                return endSessionModalContent();
            case "PASSWORD":
                return passwordModalContent();
            case "CASHOUT":
                return cashoutModalContent();
            default:
                break;
        }
    }

    return (
        <article>
            <div className={styles.card}>
                {!loading
                    ? <ul className={styles.card}>
                        <li className={`${styles.cardItem} whiteMessage mt-1`}>
                            Имя сотрудника: <span className='link'>{user.name}</span>
                        </li>
                        <li className={styles.cardItem}>
                            <button
                                className='buttonDefault mt-2'
                                onClick={() => handleGetModal(EXPENSES)}
                            >
                                Внести расходы
                            </button>
                        </li>

                        <li className={styles.cardItem}>
                            <button
                                className='buttonDefault mt-2'
                                onClick={() => handleGetModal("PASSWORD")}
                            >
                                Изменить кассу
                            </button>
                        </li>

                        <li className={styles.cardItem}>
                            <button
                                className='buttonDefault mt-2'
                                onClick={() => handleGetModal(END_SESSION)}
                            >
                                Закончить смену
                            </button>
                        </li>
                    </ul>
                    : <Modal onClose={closeModal} header='Загрузка данных'>
                        <div>
                            <p>Пожалуйста подождите</p>
                            <div>
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    spin
                                    size="5x"
                                    className="faSpinner"
                                />
                            </div>
                        </div>
                    </Modal>
                }

                {modal &&
                    <Modal onClose={closeModal} header={modalHeader}>
                        {statementSwitch()}
                    </Modal>
                }
            </div>
        </article>
    );
}

export default ProfileDetails;