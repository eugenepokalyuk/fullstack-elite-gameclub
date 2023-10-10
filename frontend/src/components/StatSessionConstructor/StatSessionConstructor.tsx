import styles from "./StatSessionConstructor.module.css";
import { fetchStatSessionData } from "../../utils/api";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../services/hooks/hooks";
import { TStoreStat, TComputerStat } from "../../services/types/types";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FETCH_STAT_SESSION_FAILURE, FETCH_STAT_SESSION_REQUEST, FETCH_STAT_SESSION_SUCCESS } from "../../services/actions/session";

export const StatSessionConstructor = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const store = useAppSelector((store) => store.store.items);

    const [storeOrders, setStoreOrders] = useState<TStoreStat[]>();
    const [computerOrders, setComputerOrders] = useState<TComputerStat[]>();
    const [loading, isLoading] = useState<boolean>(false);

    const session = useAppSelector((store) => store.stat);
    const sessionStorefront = useAppSelector((store) => store.session.stat.storefront);
    const sessionDevices = useAppSelector((store) => store.session.stat.devices);

    const closeModal = () => {
        navigate(-1);
    };

    useEffect(() => {
        dispatch({ type: FETCH_STAT_SESSION_REQUEST });
        isLoading(true);

        fetchStatSessionData()
            .then(res => {
                isLoading(false);
                setStoreOrders(res.storefront);
                setComputerOrders(res.devices);
                dispatch({ type: FETCH_STAT_SESSION_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_STAT_SESSION_FAILURE, payload: error });
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
    const calculatePCStore = () => {
        const pc = computerOrders?.reduce(
            (acc, order) => {
                if (order.payment === 'cash') {
                    acc.cash += order.price;
                } else if (order.payment === 'card') {
                    acc.card += order.price;
                }

                if (order.payment) {
                    acc.total += order.price;
                }

                return acc;
            }, {
            cash: 0,
            card: 0,
            total: 0
        });
        const store = storeOrders?.reduce(
            (acc, order) => {
                if (order.payment === 'cash') {
                    acc.cash += order.total;
                } else if (order.payment === 'card') {
                    acc.card += order.total;
                }

                if (order.payment) {
                    acc.total += order.total;
                }

                return acc;
            }, {
            cash: 0,
            card: 0,
            total: 0
        });

        if (pc && store) {
            const sumCash = pc?.cash + store?.cash;
            const sumCard = pc?.card + store?.card;
            const sumTotal = pc?.total + store?.total;

            return {
                cash: sumCash,
                card: sumCard,
                total: sumTotal,
            };
        }
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
                            <h3 className={`${styles.textShadows} text text_type_main-medium mb-8`}>{storeItem ? storeItem.name : "Ошибка"}</h3>
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
            {!loading
                ? <>
                    <article>
                        <ul className={`${styles.card} ${styles.cardFlexBetween}`}>
                            <li className={`${styles.cardStat}`}>
                                <h2>Выручка компютеров: <span className={`${styles.textShadows} text text_type_digits-medium mb-8`}>{calculateComputersTotal()}</span> руб.</h2>
                                <h2>Выручка магазина: <span className={`${styles.textShadows} text text_type_digits-medium mb-8`}>{calculateStoreTotal()}</span> руб.</h2>
                            </li>

                            <li className={`${styles.cardStat}`}>
                                <h2>Наличные: <span className={`${styles.textShadows} text text_type_digits-medium mb-8`}>{calculatePCStore()?.cash}</span> руб.</h2>
                                <h2>Безналичные: <span className={`${styles.textShadows} text text_type_digits-medium mb-8`}>{calculatePCStore()?.card}</span> руб.</h2>
                                <h2>Общая сумма: <span className={`${styles.textShadows} text text_type_digits-medium mb-8`}>{calculatePCStore()?.total}</span> руб.</h2>
                            </li>
                        </ul>
                    </article>

                    <article>
                        <h2>Продано:</h2>
                        <ul className={styles.card}>
                            {soldPositions()}
                        </ul>
                    </article>
                </>
                :
                <Modal onClose={closeModal} header="Загрузка данных">
                    <div className="mb-4 mt-4">
                    </div>
                    <div>
                        <p className={`${styles.textOrangeColor} text text_type_main-medium mb-8`}>
                            Пожалуйста подождите
                        </p>
                        <div className={`${styles.flex} text_color_inactive`}>
                            <FontAwesomeIcon
                                icon={faSpinner}
                                spin
                                size="5x"
                                className={`${styles.faSpinner}`}
                            />
                        </div>
                    </div>
                </Modal>
            }
        </>
    )
};