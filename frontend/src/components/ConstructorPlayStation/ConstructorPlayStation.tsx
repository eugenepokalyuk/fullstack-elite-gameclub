import React, { FC, useEffect, useState } from 'react';
import styles from './ConstructorPlayStation.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

const ConstructorPlayStation: FC = () => {
    return (
        <article className={styles.article}>
            <div className={styles.item}>
                <h2>PS - 1</h2>
                <button className={styles.button}>
                    <FontAwesomeIcon icon={faPlayCircle} />
                    Play
                </button>
            </div>
        </article>
    );
}

export default ConstructorPlayStation;