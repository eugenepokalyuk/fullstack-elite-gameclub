import React, { FC, useEffect, useState } from 'react';
import styles from './ConstructorItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faUnlock, faCancel, faCheck, faStop, faPause } from '@fortawesome/free-solid-svg-icons';

type Props = {
    item: {
        _id: number,
        name: string,
        status: string,
        details?: {
            price: number,
            time: {
                from: {
                    hours: number,
                    minutes: number
                },
                until: {
                    hours: number,
                    minutes: number
                }
            },
            reason: string
        }
    },
    index: number
};

const ConstructorItem: FC<Props> = ({ item, index }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [hours, setHours] = useState<string>('');
    const [minutes, setMinutes] = useState<string>('');
    const [money, setMoney] = useState<string>('');
    const [, setIsSettings] = useState<boolean>(false);
    const [, setIsPausing] = useState<boolean>(false);
    const [, setIsAccepteed] = useState<boolean>(false);

    const handleSettingsClick = () => {
        setIsSettings(false);
    }
    const handleCancelClick = () => {
        setIsEditing(false);
    }
    const handlePlayClick = () => {
        setIsEditing(true);
        console.log('play');
    }
    const handleAcceptClick = (index: any) => {
        setIsAccepteed(true);

        let data = {
            "id": index,
            "price": money,
            "time": {
                hours,
                minutes
            }
        }

        console.log(data);
    }

    const handlePauseClick = () => {
        setIsPausing(true);
    }

    if (isEditing) {
        return (
            <article className={`${styles.card} ${styles.articleOnline}`}>

                <div className={styles.cardHeader}>
                    <span className={styles.headerStatementBox}>Бронирование</span>
                    <span className={styles.headerIndexBox}>{index}</span>
                </div>

                <div className={styles.cardBody}>
                    <div className={`${styles.flex} ${styles.flexColumn} ${styles.w100}`}>
                        <div className={`${styles.flex} ${styles.flexRow} ${styles.flexCenter} ${styles.m1}`}>
                            <input className={`${styles.editingInput} ${styles.w50} ${styles.mr1}`} type="text" value={hours} onChange={(event) => setHours(event.target.value)} placeholder='Час' />
                            <input className={`${styles.editingInput} ${styles.w50}`} type="text" value={minutes} onChange={(event) => setMinutes(event.target.value)} placeholder='Минута' />
                        </div>

                        <div className={`${styles.flex} ${styles.flexRow} ${styles.flexCenter} ${styles.m1}`}>
                            <input className={`${styles.editingInput} ${styles.mr1}`} type="text" value={money} onChange={(event) => setMoney(event.target.value)} placeholder='Деньги' maxLength={6} />
                            руб.
                        </div>
                    </div>
                </div>

                <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>
                    <button className={`${styles.button} ${styles.mr1}`} onClick={() => handleAcceptClick(index)}>
                        <FontAwesomeIcon icon={faCheck} />
                        Принять
                    </button>

                    <button className={`${styles.button}`} onClick={handleCancelClick}>
                        <FontAwesomeIcon icon={faCancel} />
                        Отменить
                    </button>
                </div>

            </article>
        )
    }

    const computerStatement = (item: any) => {
        switch (item.status) {
            case "offline":
                return (
                    <article className={`${styles.card} ${styles.articleOffline}`}>

                        <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>Выключен</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>
                            {/* Empty */}
                        </div>

                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>

                        </div>
                    </article>
                )
            case "techWorks":
                return (
                    <article className={`${styles.card} ${styles.articleTech}`}>

                        <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>Тех. неполадки</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>
                            {/* Empty */}
                            <p>{item.details.reason}</p>
                        </div>

                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>
                            <button className={styles.button} onClick={handleSettingsClick}>
                                <FontAwesomeIcon icon={faStop} />
                                Возобновить работу
                            </button>
                        </div>
                    </article>
                )
            case "online":
                return (
                    <article className={`${styles.card} ${styles.articleOnline}`}>

                        <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>Свободен</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>
                            {/* Empty */}
                        </div>


                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>
                            <button className={styles.button} onClick={handlePlayClick}>
                                <FontAwesomeIcon icon={faPlayCircle} />
                                Играть
                            </button>
                        </div>

                    </article>
                )
            case "playing":
                return (
                    <article className={`${styles.card} ${styles.articleBooking}`}>

                        <div className={styles.cardHeader}>
                            <span className={styles.headerStatementBox}>Занят</span>
                            <span className={styles.headerIndexBox}>{index}</span>
                        </div>

                        <div className={styles.cardBody}>

                            <div>
                                <p>
                                    Оплачено: <span className={styles.textBold}>{item.details?.price} руб.</span>
                                </p>

                                <p>
                                    Начало <span className={styles.textBold}>{item.details?.time.from.hours}:{item.details?.time.from.minutes}</span>
                                </p>

                                <p>
                                    Конец <span className={styles.textBold}>{item.details?.time.until.hours}:{item.details?.time.until.minutes}</span>
                                </p>
                            </div>

                        </div>

                        <div className={`${styles.cardFooter} ${styles.flex} ${styles.flexRow} ${styles.flexCenter}`}>
                            <button className={`${styles.button}`} onClick={handlePauseClick}>
                                <FontAwesomeIcon icon={faPause} />
                                Пауза
                            </button>

                            <button className={`${styles.button}`} onClick={handleAcceptClick}>
                                <FontAwesomeIcon icon={faUnlock} />
                                Завершить
                            </button>
                        </div>

                    </article>
                )
            default:
                break;
        }
    }

    return (
        <>
            {computerStatement(item)}
        </>
    )
}

export default ConstructorItem;