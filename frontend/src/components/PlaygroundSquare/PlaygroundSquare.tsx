import React, { useState } from "react";
import styles from './PlaygroundSquare.module.css';
import { SquareProps, TComputer } from "../../services/types/types";
import { useAppDispatch } from '../../services/hooks/hooks';
import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from "../../services/actions/computers";
import { fetchComputersData } from "../../utils/api";
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
                            : styles.bgFree

    const endSession = computer?.details?.time.until.timestamp;
    let articleClassName;

    if (endSession) {
        const currentTimestamp = Date.now() / 1000; // Текущее время в секундах

        if (currentTimestamp >= endSession) {
            // Если текущее время больше или равно времени окончания сессии,
            // то сессия уже закончилась
            console.log('Сессия уже закончилась.');
        } else if (currentTimestamp >= endSession - 1800) {
            // Если текущее время больше или равно времени окончания сессии минус 1800 секунд (30 минут),
            // то время подходит к окончанию сессии примерно за 30 минут
            console.log('Время подходит к окончанию сессии примерно за 30 минут.');
            articleClassName = styles.warningArticle;
        } else {
            console.log('Сессия еще не закончилась.');
        }
    } else {
        console.log('Информация о времени окончания сессии отсутствует.');
    }

    return (
        <>
            <li
                className={`
                    ${styles.blocked}
                    ${styles.square}
                    ${styles.squareDefault}
                    ${id === computer?.grid_id && styles.squareOccupied} 
                    ${backgroundClass} 
                    ${computer?.status === COMPUTER_STATUS_PLAYING && articleClassName}
                    `
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

            {isLoading && (
                <Modal onClose={closeModal}>
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
            )
            }

            {
                isModalOpen && computer && (
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