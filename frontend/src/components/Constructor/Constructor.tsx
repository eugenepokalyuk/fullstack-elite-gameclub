import React, { FC } from 'react';
import styles from './Constructor.module.css';
import { useAppSelector } from '../../services/hooks/hooks';
import PlaygroundGrid from '../PlaygroundGrid/PlaygroundGrid';

const Constructor: FC = () => {
    return (
        <article className={styles.section}>
            <PlaygroundGrid />
        </article>
    );
}

export default Constructor;