import { useState } from "react";
import { TComputer } from "../../services/types/types";
import styles from './PlaygroundSquare.module.css';

interface SquareProps {
    id: number;
    position: { x: number; y: number };
    onDragStart: Function;
    onDragOver: Function;
    onDrop: Function;
    playground: TComputer[] | undefined
}

const PlaygroundSquare: React.FC<SquareProps> = ({
    id,
    position,
    onDragStart,
    onDragOver,
    onDrop,
    playground
}) => {
    // const [gridPositionFrom, setGridPositionFrom] = useState<number>();
    // const [gridPositionTo, setGridPositionTo] = useState<number>();

    const handleClick = (id1: number) => {
        const compId = playground?.find((item) => item.grid_id === id);
        console.log("handleClick", { id, id1, compId })
    }

    const compId = playground?.find((item) => item.grid_id === id);

    return (
        <div
            // className={`${styles.square}`}
            className={`${styles.square} ${id === compId?.grid_id && styles.squareOccupied}`}
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, id)}
            onClick={() => { handleClick(id) }}
        />
    );
};

export default PlaygroundSquare;