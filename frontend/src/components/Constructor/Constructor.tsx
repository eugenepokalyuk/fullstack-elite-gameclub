import React, { FC, useEffect, useState } from 'react';
import styles from './Constructor.module.css';
import ConstructorItem from '../ConstructorItem/ConstructorItem';
import ConstructorPlayStation from '../ConstructorPlayStation/ConstructorPlayStation';
import { useAppSelector } from '../../services/hooks/hooks';

const Constructor: FC = () => {
    const playground = useAppSelector(
        (store) => store.playground.computers
    );

    return (
        <article className={styles.section}>
            {playground.length > 0 && playground.map((item: any, index: number) => {
                return (
                    <ConstructorItem item={item} index={index + 1} key={index} />
                )
            })}
        </article>
    );
}

export default Constructor;