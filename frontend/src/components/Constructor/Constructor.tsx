import React, { FC } from 'react';
import styles from './Constructor.module.css';
import ConstructorItem from '../ConstructorItem/ConstructorItem';
import { useAppSelector } from '../../services/hooks/hooks';
import { TComputer } from '../../services/types/types';
const Constructor: FC = () => {
    const playground = useAppSelector(
        (store) => store.playground.computers
    );

    return (
        <article className={styles.section}>
            {playground.length > 0 && playground.map((computer: TComputer, index: number) => {
                return (
                    <ConstructorItem computer={computer} index={index + 1} key={index} />
                )
            })}
        </article>
    );
}

export default Constructor;