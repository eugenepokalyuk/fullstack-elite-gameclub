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

    const currentTime = new Date(); // получаем текущее время

    const untilTime = new Date(); // создаем объект для времени из переменной
    computer?.details && untilTime.setHours(Number(computer?.details?.time.until.hours));
    computer?.details && untilTime.setMinutes(Number(computer?.details?.time.until.minutes));

    const timeDifference = untilTime.getTime() - currentTime.getTime(); // разница в миллисекундах между текущим временем и временем до которого нужно подсчитывать

    const timeThreshold = 15 * 60 * 1000; // пороговое значение в миллисекундах, например, 30 минут
    const isApproaching = timeDifference <= timeThreshold; // флаг, указывающий, подходит ли время к текущему

    const articleClassName = `${isApproaching ? styles.warningArticle : ''}`;

    return (
        <>
            <li
                className={`
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
                onClick={() => { handleClick(computer) }}
            >
                <h1>{computer && computer.name}</h1>
            </li>

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

            {isModalOpen && computer && (
                <Modal onClose={closeModal} header={computer.name}>
                    {computer ? (
                        <ComputerDetails computer={computer} statement={statement} />
                    ) : (
                        <p className="text text_type_main-medium text_color_inactive">Ошибка при создании заказа. Попробуйте еще раз.</p>
                    )}
                </Modal>
            )}
        </>
    );
};

export default PlaygroundSquare;