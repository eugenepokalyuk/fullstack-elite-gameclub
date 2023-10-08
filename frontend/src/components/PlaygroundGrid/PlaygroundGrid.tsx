import React, { FC, useEffect, useState } from 'react';
import styles from './PlaygroundGrid.module.css';
import { TComputer } from '../../services/types/types';
import PlaygroundSquare from '../PlaygroundSquare/PlaygroundSquare';
import { fetchComputerGridReplace } from '../../utils/api';

const PlaygroundGrid: FC<{ playground: TComputer[] }> = ({ playground }) => {
    const gridSize = 200;
    const squareSize = 18;
    const [squares, setSquares] = useState<{ id: number; position: { x: number; y: number } }[]>([]);

    const [gridPositionFrom, setGridPositionFrom] = useState<number>();
    const [gridPositionTo, setGridPositionTo] = useState<number>();

    useEffect(() => {
        const initialSquares = Array.from({ length: gridSize }, (_, index) => {
            const x = (index % gridSize) * squareSize;
            const y = Math.floor(index / gridSize) * squareSize;
            return { id: index, position: { x, y } };
        });

        setSquares(initialSquares);
    }, []);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        setGridPositionTo(id);

        e.dataTransfer.setData("text/plain", id.toString());
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.preventDefault();
        const squareId = Number(e.dataTransfer.getData("text/plain"));

        const updatedSquares = squares.map((square) => {
            if (square.id === squareId) {
                return {
                    ...square,
                    position: { x: e.clientX, y: e.clientY },
                };
            }
            return square;
        });

        setGridPositionTo(squareId);

        setSquares(updatedSquares);

        // const computer = playground.find((item) => item.id === id);
        fetchComputerGridReplace(2, 42);
    };

    const renderSquares = () => {
        return squares.map((square) => {
            // const { id, position } = square;
            const computer = playground.find((item) => square.id === item.grid_id);
            // console.log("computer", playground.find((item) => square.id === item.id));

            return (
                // <div key={square.id}>
                <div key={square.id} className={`${square.id === 5 && styles.square}`}>
                    <PlaygroundSquare
                        id={square.id}
                        position={square.position}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        playground={playground}
                    />
                </div>
            );
        });
    };

    return (
        <article className={styles.article}>
            <div className={styles.grid}>
                {renderSquares()}
            </div>
        </article>
    );
}

export default PlaygroundGrid;