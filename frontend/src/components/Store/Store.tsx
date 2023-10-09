import React, { FC, useState, useEffect } from 'react';
import styles from "./Store.module.css";
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { TStoreItem } from '../../services/types/types';
import { fetchStoreData, fetchStoreSell } from '../../utils/api';
import { PaymentSwitcher } from '../PaymentSwitcher/PaymentSwitcher';
import { FETCH_STORE_FAILURE, FETCH_STORE_REQUEST, FETCH_STORE_SUCCESS } from '../../services/actions/store';

export const Store: FC = () => {
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
    const storeItems = useAppSelector((store) => store.store.items.filter((item: any) => item.qty > 0 && item.hide === false));
    const paymentType = useAppSelector((store) => store.payment.paymentType)
    const dispatch = useAppDispatch();
    const [error, setError] = useState<boolean>(false)
    const [errorDesription, setErrorDesription] = useState<string>('')

    const storeRender = async () => {
        dispatch({ type: FETCH_STORE_REQUEST });
        await fetchStoreData()
            .then(res => {
                dispatch({ type: FETCH_STORE_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_STORE_FAILURE, payload: error });
            });
    }

    useEffect(() => {
        // При изменении выбранных товаров пересчитываем общую стоимость и общее количество
        const selectedProducts = storeItems.filter((item: TStoreItem) => selectedItems.includes(item.id));
        const price = selectedProducts.reduce((total: number, product: TStoreItem) => {
            // Умножаем стоимость на количество из состояния itemCounts
            const count = itemCounts[product.id] || 0;
            return total + product.price * count;
        }, 0);
        setTotalPrice(price);

        storeRender();
    }, [selectedItems, itemCounts, dispatch]);

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
    const handleAddToCart = async () => {
        let qty = 0;
        const selectedProducts = storeItems.filter((item: TStoreItem) => selectedItems.includes(item.id))
            .map((item: TStoreItem) => {
                qty = itemCounts[item.id] || 0;
                return { ...item, qty };
            });
        const data = {
            items: selectedProducts,
            payment: paymentType
        };

        if (qty > 0) {
            fetchStoreSell(data)
                .then(res => { })
                .catch(error => {
                    setError(true);
                    setErrorDesription("Неверно указано кол-во товаров")
                });
            setSelectedItems([]);
            storeRender();
        }
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
                    )
                        : error
                            ? <>
                                <p className={styles.warningMessage}>{errorDesription}</p>
                            </>
                            : (
                                <p>Корзина пуста</p>
                            )
                    }
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