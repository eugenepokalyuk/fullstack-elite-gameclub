import React, { FC } from 'react';
import styles from './Constructor.module.css';
import { useAppSelector } from '../../services/hooks/hooks';
import PlaygroundGrid from '../PlaygroundGrid/PlaygroundGrid';

const Constructor: FC = () => {
    const playground = useAppSelector(
        (store) => store.playground.computers
    );

    return (
        <article className={styles.section}>
            <PlaygroundGrid playground={playground} />
        </article>
    );
}

export default Constructor;