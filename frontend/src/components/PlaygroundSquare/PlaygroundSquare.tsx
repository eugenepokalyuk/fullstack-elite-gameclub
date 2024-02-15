import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import { ReactComponent as Lock } from "../../images/lock.svg";
import {
    FETCH_COMPUTERS_FAILURE,
    FETCH_COMPUTERS_REQUEST,
    FETCH_COMPUTERS_SUCCESS
} from "../../services/actions/computers";
import { useAppDispatch } from '../../services/hooks/hooks';
import { SquareProps, TComputer } from "../../services/types/types";
import { fetchComputersData } from "../../utils/api";
import {
    COMPUTER_STATUS_CONTINUE,
    COMPUTER_STATUS_INFO,
    COMPUTER_STATUS_OFFLINE,
    COMPUTER_STATUS_ONLINE,
    COMPUTER_STATUS_PAUSE,
    COMPUTER_STATUS_PLAY,
    COMPUTER_STATUS_PLAYING,
    COMPUTER_STATUS_TECH,
    COMPUTER_STATUS_TECH_OFF
} from '../../utils/constants';
import ComputerDetails from "../ComputerDetails/ComputerDetails";
import Modal from "../Modal/Modal";
import styles from './PlaygroundSquare.module.css';

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
                            : styles.bgFree;




    // Определите функцию для расчета оставшегося времени в минутах
    const calculateRemainingTime = (fromTimestamp: any, untilTimestamp: any) => {
        const currentTime = Math.floor(Date.now() / 1000); // текущее время в секундах
        const remainingTime = (untilTimestamp - currentTime) / 60; // оставшееся время до завершения в минутах
        return remainingTime;
    };

    // Определите функцию для определения класса подсветки на основе оставшегося времени
    const getHighlightClass = (remainingTime: any) => {
        if (remainingTime < 10) {
            return 'highlightClass'; // Здесь подставьте класс для подсветки
        }
        return ''; // Пустая строка, если нет подсветки
    };

    // Добавьте проверку на существование объекта computer и его свойства details
    const remainingTime = computer && computer.details ? calculateRemainingTime(computer.details.time.from.timestamp, computer.details.time.until.timestamp) : 0;
    const highlightClass = remainingTime < 10 ? 'warningArticle' : '';

    const articleClassName = `${backgroundClass} ${highlightClass}`;

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