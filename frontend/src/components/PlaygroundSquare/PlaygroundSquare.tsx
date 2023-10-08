import { TComputer } from "../../services/types/types";
import styles from './PlaygroundSquare.module.css';

interface SquareProps {
    id: number;
    position: { x: number; y: number };
    // onDragStart: Function;
    // onDragOver: Function;
    // onDrop: Function;
    // occupied: boolean;
    computer: TComputer | undefined;
}

const PlaygroundSquare: React.FC<SquareProps> = ({
    id,
    position,
    computer
    // onDragStart,
    // onDragOver,
    // onDrop,
    // occupied,
}) => {
    const style = {
        left: `${position.x}px`,
        top: `${position.y}px`,
        // background: `green`
    };

    const handleClick = (e: any, id: number) => {
        console.log("handleClick", { e, computer })
    }

    // const squareClasses = `${occupied} ? ${styles.square} ${styles.occupied} : ${styles.square}`; // применяем класс styles.occupied в зависимости от занятости
    // const squareClasses = occupied ? styles.square : styles.squareOccupied; // применяем класс styles.occupied в зависимости от занятости

    return (
        <div
            // className={squareClasses}
            className={styles.square}
            // draggable
            // onDragStart={(e) => onDragStart(e, id)}
            // onDragOver={(e) => onDragOver(e)}
            // onDrop={(e) => onDrop(e, id)}
            onClick={(e) => { handleClick(e, id) }}
            style={style}
        />
    );
};

export default PlaygroundSquare;