import React, { FC, useState } from 'react';
import styles from "./PaymentSwitcher.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCoins } from '@fortawesome/free-solid-svg-icons';
import { CARD, CASH } from '../../utils/constants';

export const PaymentSwitcher: FC = () => {
    const [paymentType, setPaymentType] = useState<string>("card");

    const handlePaymentTypeChange = (type: string) => {
        setPaymentType(type);
    };
    return (
        <div className={`${styles.switcher}`}>
            <button
                className={`${styles.paymentButton} ${paymentType === "card" ? styles.activeButton : styles.nonActiveButton}`}
                onClick={() => handlePaymentTypeChange(CARD)}
            >
                <FontAwesomeIcon icon={faCreditCard} /> Безналичный
            </button>
            <button
                className={`${styles.paymentButton} ${paymentType === "cash" ? styles.activeButton : styles.nonActiveButton}`}
                onClick={() => handlePaymentTypeChange(CASH)}
            >
                <FontAwesomeIcon icon={faCoins} /> Наличный
            </button>
        </div>
    );
};