import React, { FC, useState, useEffect } from 'react';
import styles from './ConstructorItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faLock, faUnlock, faGear, faCancel, faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

type Props = {
    name: string,
    index: number
};

const ConstructorItem: FC<Props> = ({ name, index }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [hours, setHours] = useState<string>('');
    const [minutes, setMinutes] = useState<string>('');
    const [money, setMoney] = useState<string>('');
    const [isBooked, setIsBooked] = useState<boolean>(false);
    const [bookedUntil, setBookedUntil] = useState<string>('');
    const [paymentAmount, setPaymentAmount] = useState<string>('');

    const handlePlayClick = () => {
        setIsEditing(true);
    }
    const handleCancelClick = () => {
        setIsEditing(false);
    }

    const handleSettingsClick = () => {
        console.log({ settings: "settings" })
    }

    const handleAcceptClick = () => {
        setIsEditing(false);
        setIsBooked(true);

        const currentTime = new Date();
        const bookedTime = new Date(currentTime.getTime() + (parseInt(hours) * 60 + parseInt(minutes)) * 60000);
        const formattedBookedTime = bookedTime.toLocaleTimeString('it-IT');
        setBookedUntil(formattedBookedTime);
        setPaymentAmount(money);

        setTimeout(() => {
            setIsBooked(false);
        }, bookedTime.getTime() - currentTime.getTime());
    }
    const handleBookedClick = () => {
        console.log('Занято');
    }

    useEffect(() => {
        if (isBooked) {
            const currentTime = new Date();
            const bookedTime = new Date(bookedUntil);
            if (bookedTime.getTime() <= currentTime.getTime()) {
                setIsBooked(false);
            }
        }
    }, [bookedUntil, isBooked]);

    if (isEditing) {
        return (
            <article className={styles.article}>
                <div className={styles.item}>

                    <div className={styles.card}>
                        <div className={`${styles.flexRow} ${styles.w100}`}>
                            <input type="text" value={hours} onChange={(event) => setHours(event.target.value)} placeholder='Hours' />
                            <input type="text" value={minutes} onChange={(event) => setMinutes(event.target.value)} placeholder='Minutes' />
                        </div>
                        <div className={`${styles.flexRow} ${styles.flexVertCenter} ${styles.w100}`}>
                            <input type="text" value={money} onChange={(event) => setMoney(event.target.value)} placeholder='Money' maxLength={6} />
                            <p>руб.</p>
                        </div>
                    </div>

                    <div className={styles.flexRow}>
                        <button className={styles.button} onClick={handleAcceptClick}>
                            <FontAwesomeIcon icon={faCheck} />
                            Принять
                        </button>

                        <button className={`${styles.button} ${styles.ml2}`} onClick={handleCancelClick}>
                            <FontAwesomeIcon icon={faCancel} />
                            Отменить
                        </button>
                    </div>

                </div>
            </article>
        );
    }

    if (isBooked) {
        return (
            <article className={`${styles.article} ${styles.articleBooking}`}>
                <div className={styles.item}>
                    <h2>PC - {index}</h2>
                    <p>Занято до: {bookedUntil}</p>
                    <p>Сумма платежа: {paymentAmount} руб.</p>

                    <div className={`${styles.flexRow} ${styles.mt2}`}>
                        <button className={`${styles.button} ${styles.buttonBooked}`} onClick={handleBookedClick}>
                            <FontAwesomeIcon icon={faLock} />
                            Занято
                        </button>

                        <button className={`${styles.button} ${styles.ml2} ${styles.buttonBooked}`}>
                            <FontAwesomeIcon icon={faUnlock} />
                            Освободить
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className={styles.article}>
            <div className={styles.item}>
                <h2>PC - {index}</h2>
                <div className={styles.flexRow}>
                    <button className={styles.button} onClick={handlePlayClick}>
                        <FontAwesomeIcon icon={faPlayCircle} />
                        Play
                    </button>

                    <button className={`${styles.button} ${styles.buttonSettings}`} onClick={handleSettingsClick}>
                        <FontAwesomeIcon icon={faGear} />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ConstructorItem;