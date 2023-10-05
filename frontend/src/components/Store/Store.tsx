import React, { FC, useState, useEffect } from 'react';
import styles from "./Store.module.css";
import data from "../../utils/store.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCoins } from '@fortawesome/free-solid-svg-icons';

export const Store: FC = () => {
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [paymentType, setPaymentType] = useState<string>("card");

    useEffect(() => {
        // При изменении выбранных товаров пересчитываем общую стоимость
        const selectedProducts = data.filter((item) => selectedItems.includes(item._id));
        const price = selectedProducts.reduce((total, product) => total + product.price, 0);
        setTotalPrice(price);
    }, [selectedItems]);

    const handleItemClick = (itemId: any) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handlePaymentTypeChange = (type: string) => {
        setPaymentType(type);
    };

    const handleAddToCart = () => {
        const selectedProducts = data.filter((item) => selectedItems.includes(item._id));
        // Здесь вы можете выполнить действие добавления выбранных товаров в корзину, например, вызвать функцию или отправить данные на сервер.
        console.log("Выбранные товары:", selectedProducts);
        console.log("Тип оплаты:", paymentType);

    };

    return (
        <article className={`${styles.storeContainer} ${styles.mt4}`}>
            <div className={styles.card}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Стоимость</th>
                            <th>Количество</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={item._id}
                                className={selectedItems.includes(item._id) ? styles.selectedRow : ""}
                                onClick={() => handleItemClick(item._id)}
                            >
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.psc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.cart}>
                <div className={styles.cartHeader}>
                    <h2>Корзина</h2>
                </div>

                <div className={styles.cartBody}>
                    {selectedItems.length > 0 ? (
                        <ul>
                            {selectedItems.map((itemId) => {
                                const item1 = data.find((item) => item._id === itemId);
                                return <li className={styles.listRow} key={itemId}>{item1?.name}</li>;
                            })}
                        </ul>
                    ) : (
                        <p>Корзина пуста</p>
                    )}
                </div>

                <div className={styles.cartFooter}>

                    <div className={`${styles.switcher}`}>
                        <button
                            className={`${styles.paymentButton} ${paymentType === "card" ? styles.activeButton : styles.nonActiveButton}`}
                            onClick={() => handlePaymentTypeChange("card")}
                        >
                            <FontAwesomeIcon icon={faCreditCard} /> Безналичный
                        </button>
                        <button
                            className={`${styles.paymentButton} ${paymentType === "cash" ? styles.activeButton : styles.nonActiveButton}`}
                            onClick={() => handlePaymentTypeChange("cash")}
                        >
                            <FontAwesomeIcon icon={faCoins} /> Наличный
                        </button>
                    </div>

                    <button className={`${styles.submitButton} ${styles.mt2}`} onClick={handleAddToCart} disabled={selectedItems.length === 0}>
                        Оплатить
                        <span>
                            {totalPrice} руб.
                        </span>
                    </button>
                </div>
            </div>
        </article>
    );
};