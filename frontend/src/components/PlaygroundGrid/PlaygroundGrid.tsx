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
    const [dragStart, setDragStart] = useState<number>();

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
        if (id)
            setDragStart(id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.preventDefault();

        if (id) {
            fetchComputerGridReplace(dragStart, id);

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

    const renderSquares = () => {
        return squares.map((square) => (
            <PlaygroundSquare
                key={square.id}
                id={square.id}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                playground={playground}
            />
        ));
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