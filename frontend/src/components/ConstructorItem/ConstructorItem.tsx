import React, { FC } from 'react';
import styles from './ConstructorItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

type Props = {
    name: string,
    index: number
};

const ConstructorItem: FC<Props> = ({ name, index }) => {
    return (
        <article className={styles.article}>
            <div className={styles.item}>
                <h2>PC - {index}</h2>
                <button className={styles.button}>
                    <FontAwesomeIcon icon={faPlayCircle} />
                    Play
                </button>
            </div>
        </article>
    );
}

export default ConstructorItem;