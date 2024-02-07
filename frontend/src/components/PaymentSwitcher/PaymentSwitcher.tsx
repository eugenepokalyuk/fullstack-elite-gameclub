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
    const cardSwitch = paymentType === CARD ? styles.activeButton : styles.nonActiveButton;
    const cashSwitch = paymentType === CASH ? styles.activeButton : styles.nonActiveButton;

    useEffect(() => {
        setPaymentType(payment);
    })

    const handlePaymentTypeChange = (type: string) => {
        setPaymentType(type);
        dispatch({ type: SWITCH_PAYMENT_REQUEST, payload: type });
    };

    return (
        <div className={`${styles.switch} mt-1`}>
            <button
                className={`
                    buttonDefault
                    ${cardSwitch}
                `}
                onClick={() => handlePaymentTypeChange(CARD)}
            >
                <FontAwesomeIcon icon={faCreditCard} /> Безналичный
            </button>

            <button
                className={`
                    buttonDefault
                    ${cashSwitch}
                `}
                onClick={() => handlePaymentTypeChange(CASH)}
            >
                <FontAwesomeIcon icon={faCoins} /> Наличный
            </button>
        </div>
    );
};