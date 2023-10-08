import React, { FC, useEffect, useState } from 'react';
import styles from './PlaygroundGrid.module.css';
import { TComputer } from '../../services/types/types';
import PlaygroundSquare from '../PlaygroundSquare/PlaygroundSquare';

const PlaygroundGrid: FC<{ playground: TComputer[] }> = ({ playground }) => {
    const gridSize = 200;
    const squareSize = 18;
    const [squares, setSquares] = useState<{ id: number; position: { x: number; y: number } }[]>([]);

    useEffect(() => {
        const initialSquares = Array.from({ length: gridSize }, (_, index) => {
            const x = (index % gridSize) * squareSize;
            const y = Math.floor(index / gridSize) * squareSize;
            return { id: index, position: { x, y } };
        });

        setSquares(initialSquares);
    }, []);

    const renderSquares = () => {
        return squares.map((square) => {
            const { id, position } = square;
            const computer = playground.find((item) => item.id === id);
            // console.log(computer)
            return (
                <div key={square.id}>
                    <PlaygroundSquare
                        id={id}
                        position={position}
                        // onDragStart={handleDragStart}
                        // onDragOver={handleDragOver}
                        // onDrop={handleDrop}
                        // occupied={true}
                        computer={computer}
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
            {/* {playground.map((item, index) => {
                return (
                    <div className={styles.item}>
                        {index}
                    </div>
                )
            })} */}
        </article>
    );
}

export default PlaygroundGrid;