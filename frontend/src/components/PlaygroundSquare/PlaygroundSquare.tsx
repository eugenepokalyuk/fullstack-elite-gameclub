import { useState } from "react";
import { TComputer } from "../../services/types/types";
import styles from './PlaygroundSquare.module.css';
import { useAppDispatch } from '../../services/hooks/hooks';
import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from "../../services/actions/computers";
import { fetchComputersData } from "../../utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from "../Modal/Modal";
import ComputerDetails from "../ComputerDetails/ComputerDetails";
import {
    COMPUTER_STATUS_PLAY,
    COMPUTER_STATUS_PAUSE,
    COMPUTER_STATUS_FINISH,
    COMPUTER_STATUS_CONTINUE,
    COMPUTER_STATUS_TECH_ON,
    COMPUTER_STATUS_TECH_OFF,
    COMPUTER_STATUS_INFO,
    COMPUTER_STATUS_ONLINE,
    COMPUTER_STATUS_OFFLINE,
    COMPUTER_STATUS_PLAYING,
    COMPUTER_STATUS_TECH
} from '../../utils/constants';

interface SquareProps {
    id: number;
    onDragStart: Function;
    onDragOver: Function;
    onDrop: Function;
    playground: TComputer[] | any;
}

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


    const handlePlayClick = () => {
        setModalOpen(true);
        setStatement(COMPUTER_STATUS_PLAY);
    }
    const handlePauseClick = () => {
        setModalOpen(true);
        setStatement(COMPUTER_STATUS_PAUSE);
    }
    const handleFinishClick = () => {
        setModalOpen(true);
        setStatement(COMPUTER_STATUS_FINISH);
    }
    const handleContinueClick = () => {
        setModalOpen(true);
        setStatement(COMPUTER_STATUS_CONTINUE);
    }
    const handleTechOffClick = () => {
        setModalOpen(true);
        setStatement(COMPUTER_STATUS_TECH_OFF);
    }
    const handleTechOnClick = () => {
        setModalOpen(true);
        setStatement(COMPUTER_STATUS_TECH_ON);
    }

    const handleClick = (computer: TComputer) => {
        setModalOpen(true);
        switch (computer.status) {
            case COMPUTER_STATUS_ONLINE:
                setModalOpen(true);
                setStatement(COMPUTER_STATUS_PLAY);
                break;

            default:
                setStatement(COMPUTER_STATUS_INFO);
                break;
        }
    }

    const computer: TComputer = playground?.find((item: any) => item.grid_id === id);


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

    return (
        <>
            <div
                className={`${styles.square} ${id === computer?.grid_id && styles.squareOccupied} ${backgroundClass}`}
                draggable
                onDragStart={(e) => onDragStart(e, computer?.id)}
                onDragOver={(e) => onDragOver(e)}
                onDrop={(e) => onDrop(e, id)}
                onClick={() => { handleClick(computer) }}
            >
                <h1>{computer && computer.name}</h1>
            </div>

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