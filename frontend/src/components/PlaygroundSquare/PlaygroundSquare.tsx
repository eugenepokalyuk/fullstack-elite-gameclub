import { useState } from "react";
import { TComputer } from "../../services/types/types";
import styles from './PlaygroundSquare.module.css';
import { useAppDispatch } from '../../services/hooks/hooks';
import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from "../../services/actions/computers";
import { fetchComputersData } from "../../utils/api";

interface SquareProps {
    id: number;
    onDragStart: Function;
    onDragOver: Function;
    onDrop: Function;
    playground: TComputer[] | undefined | any
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

    const handleClick = (computer: TComputer) => {
        console.log(computer)
    }

    const compId = playground?.find((item: any) => item.grid_id === id);

    return (
        <div
            className={`${styles.square} ${id === compId?.grid_id && styles.squareOccupied}`}
            draggable
            onDragStart={(e) => onDragStart(e, compId?.id)}
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, id)}
            onClick={() => { handleClick(compId) }}
        >
            <h1>{compId?.name}</h1>
        </div>
    );
};

export default PlaygroundSquare;