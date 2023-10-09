import React, { FC, useEffect, useState } from 'react';
import styles from './PlaygroundGrid.module.css';
import PlaygroundSquare from '../PlaygroundSquare/PlaygroundSquare';
import { fetchComputerGridReplace, fetchComputersData } from '../../utils/api';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from '../../services/actions/computers';

const PlaygroundGrid: FC = () => {
    const dispatch = useAppDispatch();
    const playground = useAppSelector((store) => store.playground.computers);
    const gridSize = 200;
    const [squares, setSquares] = useState<{ id: number }[]>([]);

    useEffect(() => {
        const initialSquares = Array.from({ length: gridSize }, (_, index) => {
            return { id: index };
        });
        setSquares(initialSquares);
    }, []);

    useEffect(() => {
        fetchComputersData()
            .then(res => {
                dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }, [dispatch])

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        Number(e.dataTransfer.setData('text/plain', id.toString())); // Устанавливаем данные перетаскивания
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.preventDefault();
        const sourceId = Number(e.dataTransfer.getData('text/plain')); // Получаем данные перетаскивания

        if (sourceId) {
            await fetchComputerGridReplace(sourceId, id);

            dispatch({ type: FETCH_COMPUTERS_REQUEST });
            fetchComputersData()
                .then(res => {
                    dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
                })
                .catch(error => {
                    dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
                });
        }
    };

    return (
        <article className={styles.article}>
            <div className={styles.grid}>
                {squares.map((square) => (
                    <PlaygroundSquare
                        key={square.id}
                        id={square.id}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        playground={playground}
                    />
                ))}
            </div>
        </article>
    );
}

export default PlaygroundGrid;