import { FC, useState } from 'react';
import styles from './ComputerDetails.module.css';
import { ComputerDetailsProps, TComputer } from '../../services/types/types';
import { fetchContinue, fetchFinish, fetchPause, fetchPlay, fetchRemoveComputer, fetchSettings } from '../../utils/api';
import { COMPUTER_STATUS_PLAY, COMPUTER_STATUS_PAUSE, COMPUTER_STATUS_CONTINUE, COMPUTER_STATUS_PLAYING, COMPUTER_STATUS_SETTINGS } from '../../utils/constants';
import { PaymentSwitcher } from '../PaymentSwitcher/PaymentSwitcher';
import { useAppSelector } from '../../services/hooks/hooks';
const ComputerDetails: FC<ComputerDetailsProps> = ({ computer, statement }) => {
    const [price, setPrice] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [newPrice, setNewPrice] = useState<number>();
    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const paymentType = useAppSelector((store) => store.payment.paymentType)

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

        fetchPlay(computerData)
            .then(res => {
                setFinish(true);
                setFinishDescription("Бронирование завершено");
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleFinishClick = (computer: TComputer) => {
        fetchFinish(computer, newPrice, paymentType)
            .then(res => {
                setFinish(true);
                setFinishDescription("Сеанс завершен");
            })
            .catch(error => {
                setError(true)
            });
    }

    const handlePauseClick = (computer: TComputer) => {
        fetchPause(computer.id)
            .then(res => {
                setFinish(true);
                setFinishDescription("Сеанс на паузе");
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleContinueClick = (computer: TComputer) => {
        fetchContinue(computer.id)
            .then(res => {
                setFinish(true);
                setFinishDescription("Сеанс снят с паузы");
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleSettingsClick = (computer: TComputer) => {
        fetchSettings(computer)
            .then(res => {
                setFinish(true);
                setFinishDescription("Сеанс снят с паузы");
            })
            .catch(error => {
                setError(true)
            });
    }

    // const handleTechOffClick = (computer: TComputer) => {
    //     fetchTechOff(computer.id)
    //         .then(res => {
    //             setFinish(true);
    //             setFinishDescription("ПК снят с тех. обслуживания");
    //         })
    //         .catch(error => {
    //             setError(true)
    //         });
    // }
    // const handleTechOnClick = (computer: TComputer, reason: string) => {
    //     fetchTechOn(computer.id, reason)
    //         .then(res => {
    //             setFinish(true);
    //             setFinishDescription("ПК отправлен на тех. обслуживание");
    //         })
    //         .catch(error => {
    //             setError(true)
    //         });
    // }

    const handleRemoveComputerClick = (computer: TComputer) => {
        fetchRemoveComputer(computer)
            .then(res => {
                setFinish(true);
                setFinishDescription("Данное устройство успешно удалено");
            })
            .catch(error => {
                setError(true)
            });
    }

    const detailsBody = () => {
        if (finish) {
            return (
                <h2>{finishDescription}</h2>
            )
        }

        if (error) {
            return (
                <>
                    <h2>Неопознанная Ошибка!</h2>
                    <p>Запиши свои действия и опиши проблеум программисту!</p>
                </>
            )
        }

        switch (statement) {
            case COMPUTER_STATUS_PLAY:
                return (
                    <>
                        <h3>Бронирование компьютера</h3>
                        <ul className={styles.cardList}>
                            <li className={styles.listItem}>
                                <p className={styles.listText}>Часов: </p>
                                <input className={styles.listInput} type="text" value={hours} onChange={(event) => setHours(Number(event.target.value))} placeholder='Час' />
                            </li>

                            <li className={styles.listItem}>
                                <p className={styles.listText}>Минут: </p>
                                <input className={styles.listInput} type="text" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} placeholder='Минута' />
                            </li>

                            <li className={styles.listItem}>
                                <p className={styles.listText}>Сумма: </p>
                                <input className={styles.listInput} type="text" value={price} onChange={(event) => setPrice(Number(event.target.value))} placeholder='Сумма в рублях' maxLength={6} />
                            </li>

                            <PaymentSwitcher />

                            <li className={styles.mt4}>
                                <button className={`${styles.listInputSubmit} ${styles.w100}`} onClick={() => handleAcceptClick(computer)}>Принять</button>
                            </li>

                        </ul>
                    </>
                )
            case COMPUTER_STATUS_PLAYING:
                return (
                    <>
                        <h3>Устройство занято</h3>
                        <div className={styles.alignLeft}>
                            <div>
                                <p>
                                    Оплачено: <span className={styles.selectedText}>{computer.details?.price} руб.</span>
                                </p>

                                <p>
                                    Тип оплаты: <span className={styles.selectedText}>{computer.details?.payment}</span>
                                </p>
                            </div>

                            <div>
                                <p>
                                    Начало <span className={styles.selectedText}>{computer.details?.time.from.hours}:{computer.details?.time.from.minutes}</span>
                                </p>

                                <p>
                                    Конец <span className={styles.selectedText}>{computer.details?.time.until.hours}:{computer.details?.time.until.minutes}</span>
                                </p>
                            </div>
                        </div>

                        <div className={styles.dualContainer}>
                            <div>
                                <ul className={styles.cardList}>
                                    <li className={styles.listItem}>
                                        <h3>Поставить сеанс компьютера на паузу</h3>
                                    </li>

                                    <li>
                                        <button className={`${styles.listInputSubmit} ${styles.w100}`} onClick={() => handlePauseClick(computer)}>Подтвердить</button>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <ul className={styles.cardList}>
                                    <li className={styles.listItem}>
                                        <h3>Завершить сеанс компьютера</h3>
                                    </li>

                                    <li className={styles.listItem}>
                                        <p>Если сумма изменилась, напиши новое значение:</p>
                                    </li>

                                    <li className={styles.listItem}>
                                        <input className={`${styles.listInput} ${styles.mr1} ${styles.w100}`} type="text" value={newPrice} onChange={(event) => setNewPrice(Number(event.target.value))} placeholder='Сумма в рублях' maxLength={6} />
                                        <p>руб.</p>
                                    </li>

                                    <PaymentSwitcher />

                                    <li className={styles.mt4}>
                                        <button className={`${styles.listInputSubmit} ${styles.w100}`} onClick={() => handleFinishClick(computer)}>Подтвердить</button>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </>
                )
            case COMPUTER_STATUS_PAUSE:
                return (
                    <>
                        <h3>Хотите поставить сеанс компьютера на паузу?</h3>

                        <ul className={styles.cardList}>

                        </ul>

                        <div>
                            <button onClick={() => handlePauseClick(computer)}>Подтвердить</button>
                        </div>
                    </>
                )
            case COMPUTER_STATUS_CONTINUE:
                return (
                    <>
                        <h3>Хотите сеанс компьютера снять с паузы?</h3>

                        <ul className={styles.cardList}>

                        </ul>

                        <div>
                            <button onClick={() => handleContinueClick(computer)}>Подтвердить</button>
                        </div>
                    </>
                )
            case COMPUTER_STATUS_SETTINGS:
                return (
                    <>
                        <h3>Хотите изменить данные компьютера?</h3>

                        <ul className={`${styles.cardList} ${styles.settingsContainer} ${styles.cardListNullPadding} ${styles.w50}`}>
                            <li className={styles.listItem}>
                                <p>IP address:</p>
                                <input className={`${styles.listInput}`} type="text" placeholder="IP адрес устройства" disabled />
                            </li>
                            <li className={styles.listItem}>
                                <p>ID:</p>
                                <input className={`${styles.listInput}`} type="text" value={computer.id} placeholder='ID устройства' disabled />
                            </li>
                            <li className={styles.listItem}>
                                <p>Имя:</p>
                                <input className={`${styles.listInput}`} type="text" value={computer.name} placeholder='Имя устройства' />
                            </li>
                            <li className={styles.listItem}>
                                <p>Статус:</p>
                                <input className={`${styles.listInput}`} type="text" value={computer.status} placeholder='Статус устройства' disabled />
                            </li>
                            <li className={styles.listItem}>
                                <p>Ячейка:</p>
                                <input className={`${styles.listInput}`} type="text" value={computer.grid_id} placeholder='ID Ячейки устройства' disabled />
                            </li>
                        </ul>

                        <div>
                            <button onClick={() => handleSettingsClick(computer)} className={styles.mr1}>Подтвердить</button>
                            <button onClick={() => handleRemoveComputerClick(computer)} className={styles.dangerButton}>Удалить устройство</button>
                        </div>
                    </>
                )
            default:
                break;
        }
    }

    return (
        <article>
            <div className={styles.card}>
                {detailsBody()}
            </div>
        </article>
    );
}

export default ComputerDetails;