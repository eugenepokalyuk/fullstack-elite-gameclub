import { FC, useState } from 'react';
import styles from './ComputerDetails.module.css';
import { ComputerDetailsProps, TComputer } from '../../services/types/types';
import { fetchContinue, fetchEditComputerName, fetchFinish, fetchPause, fetchPlay, fetchRemoveComputer } from '../../utils/api';
import { COMPUTER_STATUS_PLAY, COMPUTER_STATUS_PAUSE, COMPUTER_STATUS_CONTINUE, COMPUTER_STATUS_PLAYING, COMPUTER_STATUS_SETTINGS } from '../../utils/constants';
import { PaymentSwitcher } from '../PaymentSwitcher/PaymentSwitcher';
import { useAppSelector } from '../../services/hooks/hooks';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ComputerDetails: FC<ComputerDetailsProps> = ({ computer, statement }) => {
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [newPrice, setNewPrice] = useState<number>();
    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const paymentType = useAppSelector((store) => store.payment.paymentType)
    const navigate = useNavigate();
    const [loading, isLoading] = useState<boolean>(false);

    const isButtonDisabled = !minutes || !price || !paymentType;

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

    function calculateTimeRemaining(from: any, until: any) {
        const fromTime: any = new Date('2023-10-10T15:23:10');
        const untilTime: any = new Date('2023-10-10T16:23:12');
        const remainingTime = untilTime - fromTime;

        // // Разбитие времени на часы, минуты и секунды
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        return (
            <p>
                {hours}:{minutes}:{seconds}
            </p>
        )
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
                        <h3>Бронирование устройства</h3>
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
                                <input className={`${styles.listInput} ${styles.w100}`} type="text" value={price} onChange={(event) => setPrice(Number(event.target.value))} placeholder='Сумма в рублях' maxLength={6} />
                            </li>

                            <PaymentSwitcher />

                            <li>
                                <button
                                    className={`${styles.listInputSubmit} ${styles.w100}`}
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

                                {/* {calculateTimeRemaining(computer.details?.time.from, computer.details?.time.until)} */}
                            </div>
                        </div>

                        <div className={styles.dualContainer}>
                            <div>
                                <ul className={styles.cardList}>
                                    <li className={styles.listItem}>
                                        <h3>Поставить сеанс на паузу</h3>
                                    </li>

                                    <li>
                                        <button className={`${styles.listInputSubmit} ${styles.w100}`} onClick={() => handlePauseClick(computer)}>Подтвердить</button>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <ul className={styles.cardList}>
                                    <li className={styles.listItem}>
                                        <h3>Завершить сеанс</h3>
                                    </li>

                                    <li className={styles.listItem}>
                                        <p>Если сумма изменилась, напиши новое значение:</p>
                                    </li>

                                    <li className={styles.listItem}>
                                        <input className={`${styles.listInput} ${styles.mr1} ${styles.w100}`} type="text" value={newPrice} onChange={(event) => setNewPrice(Number(event.target.value))} placeholder='Сумма в рублях' maxLength={6} />
                                        <p>руб.</p>
                                    </li>

                                    <PaymentSwitcher />

                                    <li className={styles.mt1}>
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
                        <h3>Поставить сеанс на паузу?</h3>

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
                        <h3>Снять сеанс с паузы?</h3>

                        <ul className={styles.cardList}>

                        </ul>

                        <div>
                            <button className={`${styles.listInputSubmit}`} onClick={() => handleContinueClick(computer)}>Подтвердить</button>
                        </div>
                    </>
                )
            case COMPUTER_STATUS_SETTINGS:
                return (
                    <>
                        <h3>Изменение данных устройства</h3>

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
                                <input className={`${styles.listInput}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Имя устройства' />
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
                            <button onClick={() => handleEditComputerNameClick(computer)} className={styles.listInputSubmit}>Подтвердить</button>
                            <button onClick={() => handleRemoveComputerClick(computer)} className={`${styles.listInputSubmit} ${styles.dangerButton}`}>Удалить устройство</button>
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
                {!loading
                    ? detailsBody()
                    : <Modal onClose={closeModal} header="Загрузка данных">
                        <div className="mb-4 mt-4">
                        </div>
                        <div>
                            <p className={`${styles.textOrangeColor} text text_type_main-medium mb-8`}>
                                Пожалуйста подождите
                            </p>
                            <div className={`${styles.flex} text_color_inactive`}>
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    spin
                                    size="5x"
                                    className={`${styles.faSpinner}`}
                                />
                            </div>
                        </div>
                    </Modal>}
            </div>
        </article>
    );
}

export default ComputerDetails;