import { ButtonHTMLAttributes, ChangeEvent, FC, HTMLAttributes, useEffect, useState } from 'react';
import styles from './ComputerDetails.module.css';
import { ComputerDetailsProps, TComputer } from '../../services/types/types';
import { fetchBlockPC, fetchCancel, fetchContinue, fetchEditComputerName, fetchFinish, fetchPause, fetchPlay, fetchRemoveComputer, fetchStatPopularPrices, fetchSwap, fetchUnblockPC } from '../../utils/api';
import { COMPUTER_STATUS_PLAY, COMPUTER_STATUS_PAUSE, COMPUTER_STATUS_CONTINUE, COMPUTER_STATUS_PLAYING, COMPUTER_STATUS_SETTINGS, CARD } from '../../utils/constants';
import { PaymentSwitcher } from '../PaymentSwitcher/PaymentSwitcher';
import { useAppSelector } from '../../services/hooks/hooks';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ComputerDetails: FC<ComputerDetailsProps> = ({ computer, statement }) => {
    const navigate = useNavigate();
    const paymentType = useAppSelector((store) => store.payment.paymentType);
    const computers = useAppSelector((store) => store.playground.computers);

    const [name, setName] = useState<string>('');

    const [price, setPrice] = useState<number>(0);
    const [newPrice, setNewPrice] = useState<number>();

    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);

    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');

    const [error, setError] = useState<boolean>(false);
    const [loading, isLoading] = useState<boolean>(false);

    const [modal, setModal] = useState<boolean>(false);
    const [param, setParam] = useState<string>('');
    const [selectedComputer, setSelectedComputer] = useState<number>();

    const [popularPrices, setPopularPrices] = useState<number[]>([]);

    const isButtonDisabled = !hours && !minutes || !price || !paymentType;

    const closeModal = () => {
        navigate(-1);
    };

    const handleAcceptClick = (computer: TComputer) => {
        let computerData = {
            "id": computer.id,
            "price": price,
            "time": {
                hours,
                minutes
            },
            "payment": paymentType
        }

        isLoading(true);
        fetchPlay(computerData)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Бронирование завершено");
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleFinishClick = (computer: TComputer) => {
        isLoading(true);
        fetchFinish(computer, newPrice, paymentType)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Сеанс завершен");
                setModal(false);
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleCancelClick = (computer: TComputer) => {
        isLoading(true);
        fetchCancel(computer)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Сеанс отменен");
                setModal(false);
            })
            .catch(error => {
                setError(true)
            });
    }
    const handleBan = (computer: TComputer, message: string) => {
        isLoading(true);
        fetchBlockPC(computer.id, message)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Устройство заблокировано");
                setModal(false);
            })
            .catch(error => {
                setError(true)
            });
    }
    const handleUnban = (computer: TComputer) => {
        isLoading(true);
        fetchUnblockPC(computer.id)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Устройство разблокировано");
                setModal(false);
            })
            .catch(error => {
                setError(true)
            });
    }
    const handleSwapClick = (computer: TComputer, selectedComputer: number | undefined) => {
        isLoading(true);
        fetchSwap(computer, selectedComputer)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Сеанс перенесен");
                setModal(false);
            })
            .catch(error => {
                setError(true)
            });
    }

    const handlePauseClick = (computer: TComputer) => {
        isLoading(true);
        fetchPause(computer.id)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Сеанс на паузе");
                setModal(false);
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleContinueClick = (computer: TComputer) => {
        isLoading(true);
        fetchContinue(computer.id)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Сеанс снят с паузы");
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleRemoveComputerClick = (computer: TComputer) => {
        isLoading(true);
        fetchRemoveComputer(computer)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Данное устройство успешно удалено");
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleEditComputerNameClick = (computer: TComputer) => {
        isLoading(true);
        fetchEditComputerName(computer, name)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Данное устройство успешно переименовано");
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleClickInnerModal = (newParam: string) => {
        setModal(true);
        setParam(newParam);
    }

    useEffect(() => {
        fetchStatPopularPrices()
            .then(res => {
                setPopularPrices(res)
            })
            .catch(error => {
                setError(true)
            });
    }, [])

    const formatTime = (timestamp: any) => {
        var date = new Date(timestamp * 1000);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        return `${hours}:${minutes}`
    }

    const calculateTimeDifference = (startTime: any, endTime: any) => {
        const startTimestamp = startTime * 1000;
        const endTimestamp = endTime * 1000;
        const timeDifference = endTimestamp - startTimestamp;

        const hours = Math.floor(timeDifference / 3600000); // 1 час = 3600000 миллисекунд
        const minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 минута = 60000 миллисекунд

        return `${hours} часов ${minutes} минут`;
    }

    const handleSetPrice = (e: any) => {
        setPrice(e.target.value);
    }

    const detailsBody = () => {
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

        switch (statement) {
            case COMPUTER_STATUS_PLAY:
                return (
                    <>
                        <h3>Бронирование устройства</h3>
                        <ul>
                            <li className={`${styles.cardButtons} mt-1`}>
                                <p>Часов:</p>
                                <input className='inputDefault' type="text" value={hours} onChange={(event) => setHours(Number(event.target.value))} placeholder='Час' />
                            </li>

                            <li className={`${styles.cardButtons} mt-1`}>
                                <p>Минут:</p>
                                <input className='inputDefault' type="text" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} placeholder='Минута' />
                            </li>

                            <li className={`${styles.cardButtons} mt-1`}>
                                <p>Сумма:</p>
                                <input className='inputDefault' type="text" value={price} onChange={(event) => setPrice(Number(event.target.value))} placeholder='Сумма в рублях' maxLength={6} />
                            </li>

                            {popularPrices
                                && <li className={`${styles.cardButtons} mt-1`}>
                                    {popularPrices.map((item: number, index: number) => {
                                        return <button key={index} className='buttonDefault' value={item} onClick={(e) => handleSetPrice(e)}>{item}</button>
                                    })}
                                </li>
                            }

                            <PaymentSwitcher />

                            {/* <li className={`${styles.cardButtons} mt-1`}>
                                <button
                                    className='buttonDefault'
                                    onClick={() => handleClickInnerModal(computer.blocked ? "UNBAN" : "BAN")}
                                >
                                    {computer.blocked ? 'Разблокировать' : 'Заблокировать'}
                                </button>
                            </li> */}

                            <li className={`${styles.cardButtons} mt-1`}>
                                <button
                                    className='buttonDefault'
                                    onClick={() => handleAcceptClick(computer)}
                                    disabled={isButtonDisabled}
                                >
                                    Принять
                                </button>
                            </li>
                        </ul>
                    </>
                )
            case COMPUTER_STATUS_PLAYING:
                let startTime = computer.details?.time.from.timestamp;
                let endTime = computer.details?.time.until.timestamp;
                let difference = calculateTimeDifference(startTime, endTime);
                const formattedStartTime = formatTime(startTime);
                const formattedEndTime = formatTime(endTime);

                return (
                    <>
                        <h3 className='mb-1'>Устройство занято</h3>

                        <ul className={`${styles.cardList} mt-2 mb-1`}>
                            <li className='whiteMessage'>Оплачено: <span className='link'>{computer.details?.price} руб.</span></li>
                            <li className='whiteMessage'>Тип оплаты: <span className='link'>{computer.details?.payment === CARD ? "Безналичный" : "Наличный"}</span></li>
                        </ul>

                        <ul className={`${styles.cardList} mt-2 mb-1`}>
                            <li className='whiteMessage'>
                                Начало <span className='link'>{formattedStartTime}</span>
                            </li>
                            <li className='whiteMessage'>
                                Конец <span className='link'>{formattedEndTime}</span>
                            </li>

                            <li className='whiteMessage'>Осталось времени: <span className='link'>{difference}</span></li>
                        </ul >

                        <ul className={`${styles.cardButtons} mb-1`}>
                            <li>
                                <button
                                    className='buttonDefault'
                                    onClick={() => handleClickInnerModal("PAUSE")}
                                >
                                    Пауза
                                </button>
                            </li>

                            <li>
                                <button
                                    className='buttonDefault'
                                    onClick={() => handleClickInnerModal("STOP")}
                                >
                                    Завершить
                                </button>
                            </li>
                        </ul>

                        <ul className={`${styles.cardButtons} mb-1`}>
                            <li>
                                <button
                                    className='buttonDefault'
                                    onClick={() => handleClickInnerModal("SWAP")}
                                >
                                    Перенос
                                </button>
                            </li>

                            <li>
                                <button
                                    className='buttonDefault'
                                    onClick={() => handleClickInnerModal("CANCEL")}
                                >
                                    Отменить сеанс
                                </button>
                            </li>
                        </ul>

                        <ul className={`${styles.cardButtons}`}>
                            <li>
                                <button
                                    className='buttonDefault'
                                    onClick={() => handleClickInnerModal(computer.blocked ? "UNBAN" : "BAN")}
                                >
                                    {computer.blocked ? 'Разблокировать' : 'Заблокировать'}
                                </button>
                            </li>
                        </ul>
                    </>
                )
            case COMPUTER_STATUS_PAUSE:
                return (
                    <>
                        <h3>Поставить сеанс на паузу?</h3>
                        <button className='buttonDefault mt-2' onClick={() => handlePauseClick(computer)}>Подтвердить</button>
                    </>
                )
            case COMPUTER_STATUS_CONTINUE:
                return (
                    <>
                        <h3>Снять сеанс с паузы?</h3>
                        <button className='buttonDefault mt-2' onClick={() => handleContinueClick(computer)}>Подтвердить</button>
                    </>
                )
            case COMPUTER_STATUS_SETTINGS:
                return (
                    <>
                        <h3>Изменение данных устройства</h3>

                        <ul>
                            <li className='mt-1'>
                                <p>IP address:</p>
                                <input className='inputDefault mt-1' type="text" placeholder="IP адрес устройства" disabled />
                            </li>
                            <li className='mt-1'>
                                <p>ID:</p>
                                <input className='inputDefault mt-1' type="text" value={computer.id} placeholder='ID устройства' disabled />
                            </li>
                            <li className='mt-1'>
                                <p>Имя:</p>
                                <input className='inputDefault mt-1' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Имя устройства' />
                            </li>
                            <li className='mt-1'>
                                <p>Статус:</p>
                                <input className='inputDefault mt-1' type="text" value={computer.status} placeholder='Статус устройства' disabled />
                            </li>
                            <li className='mt-1'>
                                <p>Ячейка:</p>
                                <input className='inputDefault mt-1' type="text" value={computer.grid_id} placeholder='ID Ячейки устройства' disabled />
                            </li>
                        </ul>

                        <div className='mt-1'>
                            <button className='buttonDefault mr-2' onClick={() => handleEditComputerNameClick(computer)}>Подтвердить</button>
                            <button className='buttonDefault dangerDefault' onClick={() => handleRemoveComputerClick(computer)}>Удалить устройство</button>
                        </div>
                    </>
                )
            default:
                break;
        }
    }

    const detailsModal = () => {
        switch (param) {
            case "PAUSE":
                return (
                    <div>
                        <ul>
                            <li>
                                <h3>Поставить сеанс на паузу</h3>
                            </li>

                            <li>
                                <button className='buttonDefault mt-2' onClick={() => handlePauseClick(computer)}>Подтвердить</button>
                            </li>
                        </ul>
                    </div>
                )
                break;
            case "STOP":
                return (
                    <div>
                        <ul>
                            <li>
                                <h3>Завершить сеанс</h3>
                            </li>

                            <li className='mt-2'>
                                <p>Если сумма изменилась, напиши новое значение:</p>
                            </li>

                            <li className='mt-2'>
                                <input className='inputDefault' type="text" value={newPrice} onChange={(event) => setNewPrice(Number(event.target.value))} placeholder='Сумма в рублях' maxLength={6} />
                            </li>

                            <PaymentSwitcher />

                            <li className='mt-2'>
                                <button className='buttonDefault' onClick={() => handleFinishClick(computer)}>Подтвердить</button>
                            </li>
                        </ul>
                    </div>
                )
                break;
            case "SWAP":
                const onlineComputers = computers.filter((computer: TComputer) => computer.status === 'online');

                return (
                    <>
                        <h3>Перенос сеанса</h3>
                        <div className='mt-2'>
                            <p>Выбери свободное устройство:</p>

                            <div>
                                <select className='selectDefault mt-2' onChange={(e) => setSelectedComputer(Number(e.target.value))}>
                                    <option value="">--</option>
                                    {onlineComputers.map((computer: TComputer) => (
                                        <option key={computer.id} value={computer.id}>{computer.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button className='buttonDefault mt-2' disabled={!selectedComputer} onClick={() => handleSwapClick(computer, selectedComputer)}>Подтвердить</button>
                        </div>
                    </>
                );
            case "CANCEL":
                return (
                    <div>
                        <h3>Отменить сеанс</h3>
                        <button className='buttonDefault mt-2' onClick={() => handleCancelClick(computer)}>Подтвердить</button>
                    </div>
                );
            case "BAN":
                return (
                    <div>
                        <h3>Заблокировать</h3>
                        <button className='buttonDefault mt-2' onClick={() => handleBan(computer, "Ваше время закончилось")}>Заблокировать</button>
                    </div>
                );
            case "UNBAN":
                return (
                    <div>
                        <h3>Разблокировать</h3>
                        <button className='buttonDefault mt-2' onClick={() => handleUnban(computer)}>Разблокировать</button>
                    </div>
                );
            default:
                break;
        }
    }

    return (
        <article>
            <div className={styles.card}>
                {!loading
                    ? modal && param ? detailsModal() : detailsBody()
                    : <Modal onClose={closeModal} header="Загрузка данных">
                        <div>
                            <p>Пожалуйста подождите</p>
                            <div>
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    spin
                                    size="5x"
                                />
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        </article>
    );
}

export default ComputerDetails;