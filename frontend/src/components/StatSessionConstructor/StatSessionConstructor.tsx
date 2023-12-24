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
import { CARD } from "../../utils/constants";

export const StatSessionConstructor = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const store = useAppSelector((store) => store.store.items);
    const [storeOrders, setStoreOrders] = useState<TStoreStat[]>();
    const [expenses, setExpenses] = useState<any[]>();
    const [computerOrders, setComputerOrders] = useState<TComputerStat[]>();
    const [cancelOrders, setCancelOrders] = useState<number>();
    const [cashout, setCashout] = useState<number>();
    
    const [loading, isLoading] = useState<boolean>(false);
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
                setExpenses(res.expenses);
                setComputerOrders(res.devices);
                setCancelOrders(res.canceled)
                setCashout(res.cashout)
                dispatch({ type: FETCH_STAT_SESSION_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_STAT_SESSION_FAILURE, payload: error });
            });
    }, [dispatch])
    const calculateComputersTotal = () => {
        const totalSum = computerOrders?.reduce((accumulator, computerOrders) => {
            return accumulator + computerOrders.price
        }, 0);
        return totalSum;
    }
    const calculateStoreTotal = () => {
        const totalSum = storeOrders?.reduce((accumulator, storeOrders) => {
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
        const storeUnicArray: TStoreStat[] | undefined = storeOrders && Array.from(storeOrders.reduce((map, order) => {
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
                {storeUnicArray && storeUnicArray?.length > 0 ? storeUnicArray?.map((item) => {
                    const storeItem = store.find((el: TStoreStat) => el.id === item.item_id);

                    return (
                        <li key={item.id} className="mr-2 p-2">
                            <h3 className="link">{storeItem ? storeItem.name : "Ошибка"}</h3>
                            <div>
                                <p>Кол-во: <span className="link">{item.qty}</span> шт.</p>
                                <p>Общая сумма: <span className="link">{item.total}</span> руб.</p>
                            </div>
                        </li>
                    )
                }) : <p>Если ничего не продано, продай сам</p>}
            </>
        )
    }
    const exponsesPositions = () => {
        const storeUnicArray = expenses && Array.from(expenses.reduce((map, order, index) => {
            const { amount } = order;

            if (map.has(index)) {
                const existingOrder = map.get(index);
                existingOrder.qty = Number(amount);
            } else {
                map.set(index, { ...order });
            }

            return map;
        }, new Map()).values());

        return (
            <>
                {storeUnicArray && storeUnicArray?.length > 0 ? storeUnicArray?.map((item: any, index) => {
                    return (
                        <li key={index} className="mr-2 p-2">
                            <h3 className="link">{item ? item.reason : "Ошибка"}</h3>
                            <div>
                                <p>Сумма: <span className="link">{item.amount}</span> руб.</p>
                            </div>
                        </li>
                    )
                }) : <p>Если ничего не продано, продай сам</p>}
            </>
        )
    }
    const getCombinedChecks = () => {
        const checkMap: any = {};
        const combinedChecks = [];

        storeOrders?.forEach((check) => {
            const { uuid } = check;

            if (checkMap[uuid]) {
                checkMap[uuid].push(check);
            } else {
                checkMap[uuid] = [check];
            }
        });

        for (const uuid in checkMap) {
            const combinedCheck = checkMap[uuid].reduce(
                (acc: any, check: any) => {
                    return {
                        ...acc,
                        uuid: check.uuid,
                        date: check.date,
                        payment: check.payment,
                        items: [...acc.items, { id: check.item_id, name: check.name, price: check.total, qty: check.qty }],
                        total: acc.total + check.total,
                    };
                },
                { uuid: "", items: [], total: 0 }
            );

            combinedChecks.push(combinedCheck);
        }

        // Сортировка объединенных чеков по дате
        combinedChecks.sort((a, b) => {
            const dateA: Date = new Date(a.date);
            const dateB: Date = new Date(b.date);
            return Number(dateB) - Number(dateA);
        });

        return combinedChecks;
    };
    const combinedCheckPositions = () => {
        const combinedChecks = getCombinedChecks();
        return (
            <>
                {combinedChecks.length > 0 ? combinedChecks.map((check, index) => {
                    return (
                        <li key={index} className={`${styles.combinedChecksItem} p-2 mr-2 mt-2`}>
                            <div>
                                <h3 className="whiteMessage">{check ? `Чек №${index + 1}` : "Ошибка"}</h3>

                                <ul className='scrollable mt-1'>
                                    {check.items.map((item: any, index: number) => (
                                        <li key={index} className="flex flexRow flexBetween flexAlignCenter mt-1 activeLink">
                                            <p>{item.name} x {item.qty}</p>
                                            <p>{item.price} руб.</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-1">
                                <p >{check.date}</p>
                                <p>Тип оплаты: <span className="link">{check.payment === CARD ? "Безналичный" : "Наличный"}</span></p>
                                <p>Общая сумма: <span className="link">{check.total}</span> руб.</p>
                            </div>
                        </li>
                    )
                }) : <p>Чеков нет, приходи завтра</p>}
            </>
        );
    };

    return (
        <>
            {!loading
                ? <>
                    <article className="mt-2">
                        <ul className={`${styles.cardList} grid grid-column-4 gap-0-6`}>
                            <li className="w-100 flex flexColumn flexAlignCenter p-2 mr-2">
                                <p className="whiteMessage">Выручка компютеров: <span className="link">{calculateComputersTotal()}</span> руб.</p>
                                <p className="whiteMessage mt-1">Выручка магазина: <span className="link">{calculateStoreTotal()}</span> руб.</p>
                            </li>

                            <li className="w-100 flex flexColumn flexAlignCenter p-2 mr-2">
                                <p className="whiteMessage">Наличные: <span className="link">{calculatePCStore()?.cash}</span> руб.</p>
                                <p className="whiteMessage mt-1">Безналичные: <span className="link">{calculatePCStore()?.card}</span> руб.</p>
                            </li>

                            <li className="w-100 flex flexColumn flexCenter flexAlignCenter p-2">
                                <p className="whiteMessage">Общая сумма: <span className="link">{calculatePCStore()?.total}</span> руб.</p>
                            </li>

                            <li className="w-100 flex flexColumn flexCenter flexAlignCenter p-2">
                                <p className="whiteMessage">Касса <span className="link">{cashout}</span></p>
                            </li>
                        </ul>
                    </article>

                    <article className="mt-2">
                        <h3 className="whiteMessage">Чеки:</h3>
                        <ul className={`${styles.cardList} grid grid-column-4 gap-0-6 mt-1`}>
                            {combinedCheckPositions()}
                        </ul>
                    </article>

                    <article className="mt-2 mb-2">
                        <h3 className="whiteMessage">Продано:</h3>
                        <ul className={`${styles.cardList} grid grid-column-4 gap-2-0 mt-1`}>
                            {soldPositions()}
                        </ul>
                    </article>

                    <article className="mt-2 mb-2">
                        <h3 className="whiteMessage">Расходы:</h3>
                        <ul className={`${styles.cardList} grid grid-column-4 gap-2-0 mt-1`}>
                            {exponsesPositions()}
                        </ul>
                    </article>

                    <article className="mt-2 mb-2">
                        <h3 className="whiteMessage">Отменено: <span className="link">{cancelOrders}</span></h3>
                    </article>
                </>
                :
                <Modal onClose={closeModal} header="Загрузка данных">
                    <div>
                        <p>Пожалуйста подождите</p>
                        <div>
                            <FontAwesomeIcon
                                icon={faSpinner}
                                spin
                                size="5x"
                            />
                        </div>
                    </div>
                </Modal>
            }
        </>
    )
};