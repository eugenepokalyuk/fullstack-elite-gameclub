import React, { FC, useEffect, useState } from 'react';
import styles from './PlaygroundGrid.module.css';
import { TComputer } from '../../services/types/types';
import PlaygroundSquare from '../PlaygroundSquare/PlaygroundSquare';
import { fetchComputerGridReplace, fetchComputersData } from '../../utils/api';
import { useAppDispatch } from '../../services/hooks/hooks';
import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from '../../services/actions/computers';

const PlaygroundGrid: FC<{ playground: TComputer[] }> = ({ playground }) => {
    const gridSize = 200;
    const squareSize = 18;
    const [squares, setSquares] = useState<{ id: number; position: { x: number; y: number } }[]>([]);

    const [gridPositionFrom, setGridPositionFrom] = useState<number>();
    const [gridPositionTo, setGridPositionTo] = useState<number>();

    const dispatch = useAppDispatch();

    useEffect(() => {
        const initialSquares = Array.from({ length: gridSize }, (_, index) => {
            const x = (index % gridSize) * squareSize;
            const y = Math.floor(index / gridSize) * squareSize;
            return { id: index, position: { x, y } };
        });

        setSquares(initialSquares);
    }, []);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        setGridPositionFrom(id);

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

        setSquares(updatedSquares);

        fetchComputerGridReplace(gridPositionFrom, id);

        dispatch({ type: FETCH_COMPUTERS_REQUEST });

        fetchComputersData()
            .then(res => {
                dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });

        // console.log("squares", squares.find((item) => {
        // item
        // }))

        // dispatch({ type: FETCH_COMPUTERS_REQUEST });
        // fetchComputersData()
        //     .then(res => {
        //         dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
        //     })
        //     .catch(error => {
        //         dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
        //     });
    };

    // useEffect(() => {
    //     dispatch({ type: FETCH_COMPUTERS_REQUEST });
    //     fetchComputersData()
    //         .then(res => {
    //             dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
    //         })
    //         .catch(error => {
    //             dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
    //         });
    // }, [dispatch])

    const renderSquares = () => {
        return squares.map((square) => {
            return (
                <div key={square.id}>
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