import { FC, useState } from 'react';
import styles from './ComputerDetails.module.css';
// import { fetchOrderNumberRequest, updateOrderNumber } from '../../services/actions/orderDetails';

import { ComputerDetailsProps, TComputer } from '../../services/types/types';
import { fetchContinue, fetchFinish, fetchPause, fetchPlay } from '../../utils/api';

const ComputerDetails: FC<ComputerDetailsProps> = ({ computer, statement }) => {
    const [price, setPrice] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);

    const [newPrice, setNewPrice] = useState<number>();

    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const computerStatusPlay = "Play";
    const computerStatusFinish = "Finish";
    const computerStatusPause = "Pause";
    const computerStatusContinue = "Continue";

    // useEffect(() => {
    //     dispatch(fetchPlayRequest());
    //     dispatch(updatePlayNumber(computer.id));
    // }, [dispatch, computer]);

    const handleAcceptClick = (computer: TComputer) => {
        let computerData = {
            "id": computer.id,
            "price": price,
            "time": {
                hours,
                minutes
            }
        }

        fetchPlay(computerData)
            .then(res => {
                setFinish(true);
                setFinishDescription("Бронирование завершено");
                // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                setError(true)
                // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }

    const handleFinishClick = (computer: TComputer) => {
        fetchFinish(computer, newPrice)
            .then(res => {
                setFinish(true);
                setFinishDescription("Сеанс завершен");
                // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                setError(true)
                // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }

    const handlePauseClick = (computer: TComputer) => {
        fetchPause(computer.id)
            .then(res => {
                setFinish(true);
                setFinishDescription("Сеанс на паузе");
                // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                setError(true)
                // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }

    const handleContinueClick = (computer: TComputer) => {
        fetchContinue(computer.id)
            .then(res => {
                setFinish(true);
                setFinishDescription("Сеанс снят с паузы");
                // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                setError(true)
                // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }

    const detailsBody = (computer: TComputer) => {
        if (finish) {
            return (
                <>
                    <h2>{finishDescription}</h2>
                </>
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

        return (
            <>
                {statement === computerStatusPlay
                    ?
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
                        </ul>

                        <div>
                            <button className={styles.listInputSubmit} onClick={() => handleAcceptClick(computer)}>Принять</button>
                        </div>
                    </>
                    : statement === computerStatusFinish ?
                        <>
                            <h3>Завершение сеанса компьютера</h3>

                            <ul className={styles.cardList}>
                                <li className={styles.listItem}>
                                    <p>Если сумма изменилась, напиши новое значение:</p>
                                </li>

                                <li className={styles.listItem}>
                                    <input className={`${styles.listInput} ${styles.mr1}`} type="text" value={newPrice} onChange={(event) => setNewPrice(Number(event.target.value))} placeholder='Сумма в рублях' maxLength={6} />
                                    <p>руб.</p>
                                </li>
                            </ul>

                            <div>
                                <button onClick={() => handleFinishClick(computer)}>Подтвердить</button>
                            </div>
                        </>
                        : statement === computerStatusPause
                            ? <>
                                <h3>Хотите поставить сеанс компьютера на паузу?</h3>

                                <ul className={styles.cardList}>

                                </ul>

                                <div>
                                    <button onClick={() => handlePauseClick(computer)}>Подтвердить</button>
                                </div>
                            </>
                            : statement === computerStatusContinue
                                ? <>
                                    <h3>Хотите сеанс компьютера снять с паузы?</h3>

                                    <ul className={styles.cardList}>

                                    </ul>

                                    <div>
                                        <button onClick={() => handleContinueClick(computer)}>Подтвердить</button>
                                    </div>
                                </>
                                : <>Пока ничего</>
                }
            </>
        )
    }

    return (
        <article>
            <h2 className={`${styles.textShadows} text text_type_digits-large mb-8`} data-cy="orderNumber">
                {computer.name}
            </h2>
            <div className={styles.card}>
                {detailsBody(computer)}
            </div>

        </article>
    );
}

export default ComputerDetails;