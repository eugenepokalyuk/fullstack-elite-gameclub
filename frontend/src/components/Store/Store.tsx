import React, { FC, useState, useEffect } from 'react';
import styles from "./Store.module.css";
import { useAppSelector } from '../../services/hooks/hooks';
import { TStoreItem } from '../../services/types/types';
import { fetchStoreSell } from '../../utils/api';
import { PaymentSwitcher } from '../PaymentSwitcher/PaymentSwitcher';

export const Store: FC = () => {
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [paymentType, setPaymentType] = useState<string>("card");
    const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
    const storeItems = useAppSelector((store) => store.store.items.filter((item: any) => item.qty > 0 && item.hide === false));

    useEffect(() => {
        // При изменении выбранных товаров пересчитываем общую стоимость и общее количество
        const selectedProducts = storeItems.filter((item: TStoreItem) => selectedItems.includes(item.id));
        const price = selectedProducts.reduce((total: number, product: TStoreItem) => {
            // Умножаем стоимость на количество из состояния itemCounts
            const count = itemCounts[product.id] || 0;
            return total + product.price * count;
        }, 0);
        setTotalPrice(price);
    }, [selectedItems, itemCounts]);

    const handleItemClick = (itemId: any) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleIncrement = (itemId: any) => {
        setItemCounts((prevCounts) => ({
            ...prevCounts,
            [itemId]: (prevCounts[itemId] || 0) + 1
        }));
    };

    const handleDecrement = (itemId: number) => {
        setItemCounts((prevCounts) => {
            const currentCount = prevCounts[itemId] || 0;
            const updatedCount = Math.max(0, currentCount - 1);
            return {
                ...prevCounts,
                [itemId]: updatedCount
            };
        });
    };

    const handleAddToCart = () => {
        const selectedProducts = storeItems.filter((item: TStoreItem) => selectedItems.includes(item.id))
            .map((item: TStoreItem) => {
                const count = itemCounts[item.id] || 0;
                return { ...item, count };
            });

        const data = {
            items: selectedProducts,
            payment: paymentType
        };

        fetchStoreSell(data)
            .then(res => {
                console.log({ res })
            })
            .catch(error => {
                console.log({ error })
            });
        // setModalOpen(false);
        setSelectedItems([]);
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
                    <tbody className={styles.cardScroll}>
                        {storeItems.map((item: TStoreItem) => (
                            <tr
                                key={item.id}
                                className={selectedItems.includes(item.id) ? styles.selectedRow : ""}
                                onClick={() => handleItemClick(item.id)}
                            >
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.qty}</td>
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
                                const item = storeItems.find((item: TStoreItem) => item.id === itemId);
                                return (

                                    <li className={styles.cartRow} key={itemId}>
                                        {item.name}
                                        <div className={styles.cartRow}>
                                            <button className={styles.symbolsCircle} onClick={() => handleDecrement(item.id)}>-</button>
                                            {itemCounts[item.id] || 0}
                                            <button className={styles.symbolsCircle} onClick={() => handleIncrement(item.id)}>+</button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p>Корзина пуста</p>
                    )}
                </div>

                <div className={styles.cartFooter}>
                    <PaymentSwitcher />
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