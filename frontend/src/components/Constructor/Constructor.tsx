import React, { FC, useEffect, useState } from 'react';
import styles from './Constructor.module.css';
import ConstructorItem from '../ConstructorItem/ConstructorItem';
import ConstructorPlayStation from '../ConstructorPlayStation/ConstructorPlayStation';
import { fetchComputersData } from '../../utils/api';


const Constructor: FC = () => {
    const [computersData, setComputersData] = useState<any[]>([]);

    useEffect(() => {
        const data = fetchComputersData();
        setComputersData(data);
    }, []);

    return (
        <article className={styles.section}>
            {computersData.length > 0 && computersData.map((item: any, index: number) => {
                return (
                    <ConstructorItem item={item} index={index + 1} key={index} />
                )
            })}
        </article>
    );
}

export default Constructor;