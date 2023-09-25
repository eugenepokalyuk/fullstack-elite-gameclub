import React, { FC, useEffect, useState } from 'react';
import styles from './Constructor.module.css';
import ConstructorItem from '../ConstructorItem/ConstructorItem';
import ConstructorPlayStation from '../ConstructorPlayStation/ConstructorPlayStation';
const Constructor: FC = () => {
    let array: any = [
        { name: "1" },
        { name: "2" },
        { name: "3" },
        { name: "4" },
        { name: "5" },
        { name: "6" },
        { name: "7" },
        { name: "8" },
        { name: "9" },
        { name: "10" },
        { name: "11" },
        { name: "12" },
        { name: "13" },
        { name: "14" },
        { name: "15" },
        { name: "16" },
        { name: "17" },
        { name: "18" },
        { name: "19" },
        { name: "20" },
        { name: "21" },
        { name: "22" },
        { name: "23" },
        { name: "24" },
        { name: "25" },
        { name: "26" },
        { name: "27" },
        { name: "28" },
        { name: "29" },
        { name: "30" }
    ];

    return (
        <>
            <section className={styles.section}>
                {array.length > 0 && array.map((item: any, index: number) => {
                    return (
                        <ConstructorItem name={item.name} index={index + 1} key={index} />
                    )
                })}
            </section>
            {/* <ConstructorPlayStation /> */}
        </>
    );
}

export default Constructor;