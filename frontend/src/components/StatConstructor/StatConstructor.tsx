import styles from "./StatConstructor.module.css";
import { fetchComputerStatData, fetchStoreStatData } from "../../utils/api";
import { useEffect, useState } from "react";
import { FETCH_COMPUTER_STAT_FAILURE, FETCH_COMPUTER_STAT_REQUEST, FETCH_COMPUTER_STAT_SUCCESS, FETCH_STORE_STAT_FAILURE, FETCH_STORE_STAT_REQUEST, FETCH_STORE_STAT_SUCCESS } from "../../services/actions/stat";
import { useAppDispatch, useAppSelector } from "../../services/hooks/hooks";
import { TStoreStat, TComputerStat } from "../../services/types/types";

export const StatConstructor = () => {
    const dispatch = useAppDispatch();
    const store = useAppSelector((store) => store.store.items);
    const [storeOrders, setStoreOrders] = useState<TStoreStat[]>();
    const [computerOrders, setComputerOrders] = useState<TComputerStat[]>();
    const from = "2019-08-24T14:15:22Z";
    const until = "2024-08-24T14:15:22Z";

    useEffect(() => {
        dispatch({ type: FETCH_STORE_STAT_REQUEST });
        fetchStoreStatData(from, until)
            .then(res => {
                setStoreOrders(res);
                dispatch({ type: FETCH_STORE_STAT_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_STORE_STAT_FAILURE, payload: error });
            });

        dispatch({ type: FETCH_COMPUTER_STAT_REQUEST });
        fetchComputerStatData(from, until)
            .then(res => {
                setComputerOrders(res);
                dispatch({ type: FETCH_COMPUTER_STAT_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_COMPUTER_STAT_FAILURE, payload: error });
            });
    }, [dispatch])

    const calculateComputersTotal = () => {
        const totalSum = computerOrders?.reduce((accumulator: any, computerOrders) => {
            return accumulator + computerOrders.price
        }, 0);
        return totalSum;
    }
    const calculateStoreTotal = () => {
        const totalSum = storeOrders?.reduce((accumulator: any, storeOrders) => {
            return accumulator + storeOrders.total
        }, 0);
        return totalSum;
    }

    const soldPositions = () => {
        const storeUnicArray = storeOrders && Array.from(storeOrders.reduce((map, order) => {
            const { item_id, qty, total } = order;

            if (map.has(item_id)) {
                const existingOrder = map.get(item_id);
                existingOrder.qty += Number(qty);
                existingOrder.total += total;
            } else {
                map.set(item_id, { ...order });
            }

            return map;
        }, new Map()).values());
        return (
            <>
                {storeUnicArray && storeUnicArray?.map((item) => {
                    const storeItem = store.find((el: any) => el.id === item.item_id);

                    return (
                        <li key={item.id} className={`${styles.cardItem} ${styles.heightSmall} ${styles.flexBetween}`}>
                            <h3 className={`${styles.textShadows} text text_type_main-medium mb-8`}>{storeItem.name}</h3>
                            <div>
                                <p>Кол-во: <span className={styles.selectedText}>{item.qty}</span></p>
                                <p>Общая сумма: <span className={styles.selectedText}>{item.total}</span></p>
                            </div>
                        </li>
                    )
                })}
            </>
        )
    }

    return (
        <>
            <article>
                <h2>Выручка компютеров: <span className={`${styles.textShadows} text text_type_digits-medium mb-8`}>{calculateComputersTotal()}</span> руб.</h2>
                <h2>Выручка магазина: <span className={`${styles.textShadows} text text_type_digits-medium mb-8`}>{calculateStoreTotal()}</span> руб.</h2>
            </article>

            <article>
                <h2>Продано:</h2>
                <ul className={styles.card}>
                    {soldPositions()}
                </ul>
            </article>
        </>
    )
};