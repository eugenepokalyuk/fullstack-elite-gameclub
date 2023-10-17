import styles from "./StatConstructor.module.css";
import React, { HTMLInputTypeAttribute, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchStatSessionData } from "../../utils/api";
import { FETCH_STAT_FAILURE, FETCH_STAT_REQUEST, FETCH_STAT_SUCCESS } from "../../services/actions/stat";
import { useAppDispatch, useAppSelector } from "../../services/hooks/hooks";
import { TComputerStat, TStoreStat } from "../../services/types/types";

interface Data {
    storefront: TStoreStat[];
    devices: TComputerStat[];
}

export const StatConstructor = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const store = useAppSelector((store) => store.store.items);
    const [loading, isLoading] = useState<boolean>(false);
    const [from, setFrom] = useState<string>("");
    const [until, setUntil] = useState<string>("");
    const [data, setData] = useState<any>();

    const closeModal = () => {
        navigate(-1);
    };


    const handleFromDateChange = (e: any) => {
        setFrom(e.target.value);
    };

    const handleUntilDateChange = (e: any) => {
        setUntil(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        type TDate = {
            from: string,
            until: string
        }

        const date: TDate = {
            from: from + 'T00:00:00Z',
            until: until + 'T00:00:00Z'
        }

        dispatch({ type: FETCH_STAT_REQUEST });
        isLoading(true);

        fetchStatSessionData(date.from, date.until)
            .then(res => {
                isLoading(false);
                setData(res);
                dispatch({ type: FETCH_STAT_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_STAT_FAILURE, payload: error });
            });

    };

    function getTotalPriceAndCountByPCId(): { name: string, pc_id: number; totalPrice: number; totalCount: number }[] {
        const pcTotals: { [key: number]: { name: string, totalPrice: number; totalCount: number } } = {};

        data && data.devices.forEach((purchase: TComputerStat) => {
            const { name, pc_id, price } = purchase;

            if (!pcTotals[pc_id]) {
                pcTotals[pc_id] = { name: name, totalPrice: 0, totalCount: 0 };
            }

            pcTotals[pc_id].totalPrice += price;
            pcTotals[pc_id].totalCount++;
        });

        const result = Object.keys(pcTotals).map((pc_id) => ({
            pc_id: Number(pc_id),
            name: pcTotals[Number(pc_id)].name,
            totalPrice: pcTotals[Number(pc_id)].totalPrice,
            totalCount: pcTotals[Number(pc_id)].totalCount,
        }));

        return result;
    }

    const getTotalQtyByItem = () => {
        const itemTotals: { [key: number]: { name: string, qty: number; total: number } } = {};

        data && data.storefront.forEach((item: TStoreStat) => {
            const { item_id, qty, total, name } = item;

            if (!itemTotals[item_id]) {
                itemTotals[item_id] = { name: name, qty: 0, total: 0 };
            }

            itemTotals[item_id].qty += qty;
            itemTotals[item_id].total += total;
        });

        const result = Object.keys(itemTotals).map((item_id) => ({
            item_id: Number(item_id),
            name: itemTotals[Number(item_id)].name,
            qty: itemTotals[Number(item_id)].qty,
            total: itemTotals[Number(item_id)].total,
        }));

        return result;
    }

    const getQtyBySupplyItem = () => {
        const itemTotals: { [key: number]: { name: string, qty: number } } = {};

        data && data.supplies.forEach((item: TStoreStat) => {
            const { item_id, qty, name } = item;

            if (!itemTotals[item_id]) {
                itemTotals[item_id] = { name: name, qty: 0 };
            }

            itemTotals[item_id].qty += qty;
        });

        const result = Object.keys(itemTotals).map((item_id) => ({
            item_id: Number(item_id),
            name: itemTotals[Number(item_id)].name,
            qty: itemTotals[Number(item_id)].qty,
        }));

        return result;
    }

    function calculatePaymentTotals(): {
        cashTotalStorefront: number;
        cardTotalStorefront: number;
        cashTotalDevices: number;
        cardTotalDevices: number;
        total: number;
    } {
        let cashTotalStorefront = 0;
        let cardTotalStorefront = 0;
        let cashTotalDevices = 0;
        let cardTotalDevices = 0;

        data && data.storefront.forEach((item: TStoreStat) => {
            if (item.payment === "cash") {
                cashTotalStorefront += item.total;
            } else if (item.payment === "card") {
                cardTotalStorefront += item.total;
            }
        });

        data && data.devices.forEach((item: TComputerStat) => {
            if (item.payment === "cash") {
                cashTotalDevices += item.price;
            } else if (item.payment === "card") {
                cardTotalDevices += item.price;
            }
        });

        const total = cashTotalStorefront + cardTotalStorefront + cashTotalDevices + cardTotalDevices;

        return {
            cashTotalStorefront,
            cardTotalStorefront,
            cashTotalDevices,
            cardTotalDevices,
            total,
        };
    }

    return (
        <>
            {!loading
                ? <>
                    <article>
                        <form onSubmit={handleSubmit}>
                            <h2 className="whiteMessage">Выбери дату:</h2>
                            <div className={`${styles.card} flex flexAlignCenter flexBetween p-2 mt-1`}>
                                <ul className="flex">
                                    <li className="flex flexAlignCenter">
                                        <p>От:</p>
                                        <div className="ml-1">
                                            <input type="date" value={from} onChange={handleFromDateChange} className='inputDate' />
                                        </div>
                                    </li>

                                    <li className="flex flexAlignCenter">
                                        <p>До:</p>
                                        <div className="ml-1">
                                            <input type="date" value={until} onChange={handleUntilDateChange} className='inputDate' />
                                        </div>
                                    </li>
                                </ul>

                                <div>
                                    <button className="buttonDefault" type="submit">Принять</button>
                                </div>
                            </div>
                        </form>
                    </article>

                    {data
                        ? <>
                            <article className="mt-2 mb-2">
                                <h3 className="whiteMessage">Деньги:</h3>
                                <ul className={`${styles.cardList} grid grid-column-4 gap-2-0 mt-1`}>
                                    <li className="p-2">
                                        <h3 className="link">Устройства</h3>
                                        <div>
                                            <p>Безналичный: <span className="link">{calculatePaymentTotals().cardTotalDevices}</span> руб.</p>
                                            <p>Наличный: <span className="link">{calculatePaymentTotals().cashTotalDevices}</span> руб.</p>
                                        </div>
                                    </li>

                                    <li className="p-2">
                                        <h3 className="link">Магазин</h3>
                                        <div>
                                            <p>Безналичный: <span className="link">{calculatePaymentTotals().cardTotalStorefront}</span> руб.</p>
                                            <p>Наличный: <span className="link">{calculatePaymentTotals().cashTotalStorefront}</span> руб.</p>
                                        </div>
                                    </li>

                                    <li className="p-2">
                                        <h3 className="link">Тип оплаты</h3>
                                        <div>
                                            <p>Безналичный: <span className="link">{calculatePaymentTotals().cardTotalDevices + calculatePaymentTotals().cardTotalStorefront}</span> руб.</p>
                                            <p>Наличный: <span className="link">{calculatePaymentTotals().cashTotalDevices + calculatePaymentTotals().cashTotalStorefront}</span> руб.</p>
                                        </div>
                                    </li>

                                    <li className="p-2">
                                        <h3 className="link">Общая сумма</h3>
                                        <div>
                                            <p>Итого: <span className="link">{calculatePaymentTotals().total}</span> руб.</p>
                                        </div>
                                    </li>
                                </ul>
                            </article>

                            <article className="mt-2 mb-2">
                                <h3 className="whiteMessage">Устройства:</h3>
                                <ul className={`${styles.cardList} grid grid-column-4 gap-2-0 mt-1`}>
                                    {getTotalPriceAndCountByPCId().map((item) => {
                                        return item && (
                                            <li key={item.pc_id} className="p-2">
                                                <h3 className="link">{item.name}</h3>
                                                <div>
                                                    <p>Кол-во: <span className="link">{item.totalCount}</span> шт.</p>
                                                    <p>Общая сумма: <span className="link">{item.totalPrice}</span> руб.</p>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </article>

                            <article className="mt-2 mb-2">
                                <h3 className="whiteMessage">Продано товаров:</h3>
                                <ul className={`${styles.cardList} grid grid-column-4 gap-2-0 mt-1`}>
                                    {getTotalQtyByItem().map((item) => {
                                        return item && (
                                            <li key={item.item_id} className="p-2">
                                                <h3 className="link">{item.name}</h3>
                                                <div>
                                                    <p>Кол-во: <span className="link">{item.qty}</span> шт.</p>
                                                    <p>Общая сумма: <span className="link">{item.total}</span> руб.</p>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </article>

                            <article className="mt-2 mb-2">
                                <h3 className="whiteMessage">Приход товаров:</h3>
                                <ul className={`${styles.cardList} grid grid-column-4 gap-2-0 mt-1`}>
                                    {getQtyBySupplyItem().map((item) => {
                                        return item && (
                                            <li key={item.item_id} className="p-2">
                                                <h3 className="link">{item.name}</h3>
                                                <div>
                                                    <p>Кол-во: <span className="link">{item.qty}</span> шт.</p>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </article>

                            <article className="mt-2 mb-2">
                                <h3 className="whiteMessage">Списания товаров:</h3>
                                <ul className={`${styles.cardList} grid grid-column-4 gap-2-0 mt-1`}>
                                    {data
                                        && data.writeoff.exp
                                        && <li className="p-2">
                                            <h3 className="link">Срок годности</h3>
                                            <div>
                                                <p>Кол-во: <span className="link">{data.writeoff.exp.qty}</span> шт.</p>
                                                <p>Сумма: <span className="link">{data.writeoff.exp.sum}</span> руб.</p>
                                            </div>
                                        </li>
                                    }

                                    {data
                                        && data.writeoff.person
                                        && <li className="p-2">
                                            <h3 className="link">Сотрудники</h3>
                                            <div>
                                                <p>Кол-во: <span className="link">{data.writeoff.person.qty}</span> шт.</p>
                                                <p>Сумма: <span className="link">{data.writeoff.person.sum}</span> руб.</p>
                                            </div>
                                        </li>
                                    }
                                </ul>
                            </article>
                        </>
                        : <article className="mt-2 mb-2">
                            <h3 className="whiteMessage">Здесь пусто!</h3>
                            <p>Чтобы собрать статистику, нужно выбрать две даты</p>
                        </article>
                    }
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