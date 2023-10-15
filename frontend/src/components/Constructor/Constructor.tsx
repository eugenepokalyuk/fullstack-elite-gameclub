import React, { FC } from 'react';
import styles from './Constructor.module.css';
import PlaygroundGrid from '../PlaygroundGrid/PlaygroundGrid';
import { Clock } from '../Clock/Clock';

const Constructor: FC = () => {
    return (
        <>
            <PlaygroundGrid />
            <Clock />
        </>
    );
}

export default Constructor;