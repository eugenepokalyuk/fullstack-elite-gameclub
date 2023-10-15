import React, { FC, useEffect, useState } from 'react';
import styles from "./PaymentSwitcher.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCoins } from '@fortawesome/free-solid-svg-icons';
import { CARD, CASH } from '../../utils/constants';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { SWITCH_PAYMENT_REQUEST } from '../../services/actions/payment';

export const PaymentSwitcher: FC = () => {
    const dispatch = useAppDispatch();
    const [paymentType, setPaymentType] = useState<string>(CARD);
    const payment = useAppSelector((store) => store.payment.paymentType);

    useEffect(() => {
        setPaymentType(payment);

        console.log("paymentType", paymentType)
    })

    const handlePaymentTypeChange = (type: string) => {
        setPaymentType(type);
        dispatch({ type: SWITCH_PAYMENT_REQUEST, payload: type });
    };

    return (
        <div className={`${styles.switcher}`}>
            <button
                className={`
                    ${styles.paymentButton} 
                    ${paymentType === CARD ? styles.activeButton : styles.nonActiveButton}
                `}
                onClick={() => handlePaymentTypeChange(CARD)}
            >
                <FontAwesomeIcon icon={faCreditCard} /> Безналичный
            </button>

            <button
                className={`
                    ${styles.paymentButton} 
                    ${paymentType === CASH ? styles.activeButton : styles.nonActiveButton}
                `}
                onClick={() => handlePaymentTypeChange(CASH)}
            >
                <FontAwesomeIcon icon={faCoins} /> Наличный
            </button>
        </div>
    );
};