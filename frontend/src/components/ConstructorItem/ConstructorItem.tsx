import React, { FC, useState } from 'react';
import styles from './ConstructorItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faUnlock, faStopCircle, faStop, faPauseCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchComputersData } from '../../utils/api';
import Modal from '../Modal/Modal';
import ComputerDetails from '../ComputerDetails/ComputerDetails';
import { TComputer } from '../../services/types/types';
import { useAppDispatch } from '../../services/hooks/hooks';
import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from '../../services/actions/computers';

type Props = {
    computer: TComputer,
    index: number,
};

const ConstructorItem: FC<Props> = ({ computer, index }) => {
    const dispatch = useAppDispatch();
    const [isLoading,] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [statement, setStatement] = useState<string>('');

    const PLAY = "Play";
    const PAUSE = "Pause";
    const FINISH = "Finish";
    const CONTINUE = "Continue";
    const TECH_OFF = "TechOff";
    const TECH_ON = "TechOn";

    const closeModal = () => {
        dispatch({ type: FETCH_COMPUTERS_REQUEST });

        fetchComputersData()
            .then(res => {
                dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
        setModalOpen(false);
    };

    const handlePlayClick = () => {
        setModalOpen(true);
        setStatement(PLAY);
    }
    const handlePauseClick = () => {
        setModalOpen(true);
        setStatement(PAUSE);
    }
    const handleFinishClick = () => {
        setModalOpen(true);
        setStatement(FINISH);
    }
    const handleContinueClick = () => {
        setModalOpen(true);
        setStatement(CONTINUE);
    }
    const handleTechOffClick = () => {
        setModalOpen(true);
        setStatement(TECH_OFF);
    }
    const handleTechOnClick = () => {
        setModalOpen(true);
        setStatement(TECH_ON);
    }

    const computerStatement = (item: any) => {
        switch (item.status) {
            case "pause":
                return (
                    <article className={`${styles.card} ${styles.articleOffline}`}>
                        {/* <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>На паузе</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>
                        </div>

                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>
                            <button className={styles.button} onClick={handleContinueClick}>
                                <FontAwesomeIcon icon={faStopCircle} />
                                Продолжить
                            </button>
                        </div> */}
                    </article>
                )
            case "offline":
                return (
                    <article className={`${styles.card} ${styles.articleOffline}`}>
                        {/* <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>Выключен</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>
                        </div>

                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>

                        </div> */}
                    </article>
                )
            case "techWorks":
                return (
                    <article className={`${styles.card} ${styles.articleTech}`}>
                        {/* <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>Тех. неполадки</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>
                            <p>{item.details.reason}</p>
                        </div>

                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>
                            <button className={styles.button} onClick={handleTechOffClick}>
                                <FontAwesomeIcon icon={faStop} />
                                Возобновить работу
                            </button>
                        </div> */}
                    </article>
                )
            case "online":
                return (
                    <article className={`${styles.card} ${styles.articleOnline}`}>
                        {/* <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>Свободен</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>
                        </div>


                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>
                            <button className={styles.button} onClick={handlePlayClick}>
                                <FontAwesomeIcon icon={faPlayCircle} />
                                Играть
                            </button>
                        </div> */}
                    </article>
                )
            case "playing":
                const currentTime = new Date(); // получаем текущее время

                const untilTime = new Date(); // создаем объект для времени из переменной
                untilTime.setHours(item.details?.time.until.hours);
                untilTime.setMinutes(item.details?.time.until.minutes);

                const timeDifference = untilTime.getTime() - currentTime.getTime(); // разница в миллисекундах между текущим временем и временем до которого нужно подсчитывать

                const timeThreshold = 5 * 60 * 1000; // пороговое значение в миллисекундах, например, 30 минут
                const isApproaching = timeDifference <= timeThreshold; // флаг, указывающий, подходит ли время к текущему

                const articleClassName = `${styles.card} ${styles.articleBooking} ${isApproaching ? styles.warningArticle : ''}`;

                return (
                    <article className={articleClassName}>
                        {/* <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>Занят</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>
                            <div>
                                <p>
                                    Оплачено: <span className={styles.textBold}>{item.details?.price} руб.</span>
                                </p>

                                <p>
                                    Начало <span className={styles.textBold}>{item.details?.time.from.hours}:{item.details?.time.from.minutes}</span>
                                </p>

                                <p>
                                    Конец <span className={styles.textBold}>{item.details?.time.until.hours}:{item.details?.time.until.minutes}</span>
                                </p>
                            </div>

                        </div>

                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>
                            <button className={`${styles.button}`} onClick={handlePauseClick}>
                                <FontAwesomeIcon icon={faPauseCircle} />
                                Пауза
                            </button>

                            <button className={`${styles.button}`} onClick={handleFinishClick}>
                                <FontAwesomeIcon icon={faUnlock} />
                                Завершить
                            </button>
                        </div> */}
                    </article>
                )
            default:
                break;
        }
    }

    return (
        <section>
            {/* {computerStatement(computer)} */}
            {isLoading && (
                <Modal onClose={closeModal}>
                    <div className={styles.modalContent}>
                        <h1 className="text text_type_main-large mb-8">Оформляем заказ</h1>
                        <p className="text text_type_main-medium text_color_inactive mb-8">
                            Подождите пожалуйста, примерное время ожидание 15 сек.
                        </p>
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            size="5x"
                            className={`${styles.faSpinner}`}
                        />
                    </div>
                </Modal>
            )}

            {isModalOpen && (
                <Modal onClose={closeModal} header={computer.name}>
                    {computer ? (
                        <ComputerDetails computer={computer} statement={statement} />
                    ) : (
                        <p className="text text_type_main-medium text_color_inactive">Ошибка при создании заказа. Попробуйте еще раз.</p>
                    )}
                </Modal>
            )}
        </section>
    )
}

export default ConstructorItem;