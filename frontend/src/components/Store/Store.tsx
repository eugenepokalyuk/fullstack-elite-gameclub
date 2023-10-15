import React, { FC, useState, useEffect } from 'react';
import styles from "./Store.module.css";
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { TStoreItem } from '../../services/types/types';
import { fetchStoreData } from '../../utils/api';
import { PaymentSwitcher } from '../PaymentSwitcher/PaymentSwitcher';
import { FETCH_STORE_FAILURE, FETCH_STORE_REQUEST, FETCH_STORE_SUCCESS } from '../../services/actions/store';
import { STORE_OPEN_CART } from '../../utils/constants';
import StoreDetails from '../StoreDetails/StoreDetails';
import Modal from '../Modal/Modal';
import { useNavigate } from 'react-router-dom';

export const Store: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
    const storeItems = useAppSelector((store) => store.store.items.filter((item: any) => item.qty > 0 && item.hide === false));
    const [error, setError] = useState<boolean>(false);
    const [errorDesription, ] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [statement, setStatement] = useState<string>('');

    const paymentType = useAppSelector((store) => store.payment.paymentType)

    const closeModal = () => {
        navigate(-1)
    };

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
    useEffect(() => {
        const selectedProducts = storeItems.filter((item: TStoreItem) => selectedItems.includes(item.id));
        const price = selectedProducts.reduce((total: number, product: TStoreItem) => {
            const count = itemCounts[product.id] || 1;
            return total + product.price * count;
        }, 0);
        setTotalPrice(price);

        storeRender();
    }, [selectedItems, dispatch]);
    let qty = 0;

    const selectedProducts = storeItems.filter((item: TStoreItem) => selectedItems.includes(item.id))
        .map((item: TStoreItem) => {
            qty = itemCounts[item.id] || 1;
            return { ...item, qty };
        });

    const handleAddToCart = async () => {
        setModalOpen(true);
        setStatement(STORE_OPEN_CART);
    }

    return (
        <>
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
                                                <button className={styles.symbolsCircle} onClick={() => handleDecrement(item.id)}>
                                                    -
                                                </button>

                                                {itemCounts[item.id] || 1}

                                                <button className={styles.symbolsCircle} onClick={() => handleIncrement(item.id)}>
                                                    +
                                                </button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )
                            : error
                                ? <p className={styles.warningMessage}>{errorDesription}</p> : <p>Корзина пуста</p>
                        }
                    </div>

                    <div className={styles.cartFooter}>
                        <PaymentSwitcher />
                        <button className={`${styles.submitButton}`} onClick={handleAddToCart} disabled={selectedItems.length === 0}>
                            Оплатить
                            <span>
                                {totalPrice} руб.
                            </span>
                        </button>
                    </div>

                </div>
            </article>

            {isModalOpen && storeItems && (
                <Modal onClose={closeModal} header={"Корзина"}>
                    <StoreDetails statement={statement} selectedProducts={selectedProducts} payment={paymentType} />
                </Modal>
            )}
        </>
    );
};