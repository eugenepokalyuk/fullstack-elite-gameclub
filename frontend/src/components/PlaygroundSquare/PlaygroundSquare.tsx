import React, { useState, useEffect } from "react";
import styles from './PlaygroundSquare.module.css';
import { SquareProps, TComputer } from "../../services/types/types";
import { useAppDispatch } from '../../services/hooks/hooks';
import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from "../../services/actions/computers";
import { fetchBlockPC, fetchComputersData, fetchNotificationToPc } from "../../utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from "../Modal/Modal";
import ComputerDetails from "../ComputerDetails/ComputerDetails";
import { COMPUTER_STATUS_PLAY, COMPUTER_STATUS_PAUSE, COMPUTER_STATUS_CONTINUE, COMPUTER_STATUS_INFO, COMPUTER_STATUS_ONLINE, COMPUTER_STATUS_OFFLINE, COMPUTER_STATUS_PLAYING, COMPUTER_STATUS_TECH, COMPUTER_STATUS_TECH_OFF } from '../../utils/constants';
import { ReactComponent as Lock } from "../../images/lock.svg";

const PlaygroundSquare: React.FC<SquareProps> = ({
    id,
    onDragStart,
    onDragOver,
    onDrop,
    playground
}) => {
    const dispatch = useAppDispatch();
    const [isLoading,] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [statement, setStatement] = useState<string>('');

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

    const handleClick = (computer: TComputer) => {
        setModalOpen(true);
        if (computer) {
            switch (computer.status) {
                case COMPUTER_STATUS_ONLINE:
                    setModalOpen(true);
                    setStatement(COMPUTER_STATUS_PLAY);
                    break;
                case COMPUTER_STATUS_PLAYING:
                    setModalOpen(true);
                    setStatement(COMPUTER_STATUS_PLAYING);
                    break;
                case COMPUTER_STATUS_PAUSE:
                    setModalOpen(true);
                    setStatement(COMPUTER_STATUS_CONTINUE);
                    break;
                case COMPUTER_STATUS_TECH:
                    setModalOpen(true);
                    setStatement(COMPUTER_STATUS_TECH_OFF);
                    break;
                default:
                    setModalOpen(true);
                    setStatement(COMPUTER_STATUS_INFO);
                    break;
            }
        }
    }

    const showNotification = (timeLeft: number) => {
        const message = `Осталось ${timeLeft} минут до окончания сессии`;
        fetchNotificationToPc(computer.id, message);
    };

    const sendExpiredNotification = () => {
        const message = `Ваше время закончилось, пожалуйста обратитесь к администратору.`;
        fetchBlockPC(computer.id, message);
    }

    const computer: TComputer = playground?.find((item: TComputer) => item.grid_id === id);

    const backgroundClass =
        computer?.status === COMPUTER_STATUS_ONLINE
            ? styles.bgOnline
            : computer?.status === COMPUTER_STATUS_OFFLINE
                ? styles.bgOffline
                : computer?.status === COMPUTER_STATUS_PLAYING
                    ? styles.bgPlay
                    : computer?.status === COMPUTER_STATUS_TECH
                        ? styles.bgTech
                        : computer?.status === COMPUTER_STATUS_PAUSE
                            ? styles.bgPause
                            : styles.bgFree;
    let articleClassName;

    const endSession = computer?.details?.time.until.timestamp;

    useEffect(() => {
        const interval = setInterval(() => {
            // checkComputersStatus();
            // console.log(1);
        }, 1000); // Проверка каждую секунду

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, []); // Пустой массив зависимостей, чтобы эффект запускался только один раз

    // const checkComputersStatus = () => {
    //     playground.forEach((computer: TComputer) => {
    //         if (computer.status === COMPUTER_STATUS_PLAYING) {
    //             const currentTimestamp = Date.now() / 1000; // Текущее время в секундах
    //             if (endSession) {
    //                 const timeLeft = Math.floor((endSession - currentTimestamp) / 60); // Время до окончания сессии в минутах
    //                 if (timeLeft === 30) {
    //                     showNotification(timeLeft);
    //                 }
    //             }
    //         }
    //     });
    // };

    return (
        <>
            <li
                className={`
                    ${styles.blocked}
                    ${styles.square}
                    ${styles.squareDefault}
                    ${id === computer?.grid_id && styles.squareOccupied} 
                    ${backgroundClass} 
                    ${computer?.status === COMPUTER_STATUS_PLAYING && articleClassName}`
                }

                draggable
                onDragStart={(e) => onDragStart(e, computer?.id)}
                onDragOver={(e) => onDragOver(e)}
                onDrop={(e) => onDrop(e, id)}
                onClick={() => {
                    handleClick(computer)
                }}
            >
                {/* #toDo */}
                {computer?.blocked && (
                    <div className={styles.lockIcon}>
                        <Lock />
                    </div>
                )}
                <p>{computer && computer.name}</p>
            </li >

            {isLoading &&
                (
                    <Modal onClose={closeModal}>
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
                )
            }

            {
                isModalOpen && computer &&
                (
                    <Modal onClose={closeModal} header={computer.name}>
                        {computer ? (
                            <ComputerDetails computer={computer} statement={statement} />
                        ) : (
                            <p className="text text_type_main-medium">Ошибка при создании заказа. Попробуйте еще раз.</p>
                        )}
                    </Modal>
                )
            }
        </>
    );
};

export default PlaygroundSquare;