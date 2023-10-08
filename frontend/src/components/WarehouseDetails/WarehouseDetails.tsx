import { FC, useEffect, useState } from 'react';
import styles from './WarehouseDetails.module.css';
import { useAppSelector } from '../../services/hooks/hooks';

import { TStoreItem, WarehouseDetailsProps } from '../../services/types/types';
import { fetchWarehouseAddItem, fetchWarehouseAddSupply, fetchWarehouseEditItemName, fetchWarehouseEditItemPrice, fetchWarehouseHideItem, fetchWarehouseItem, fetchWarehouseShowItem } from '../../utils/api';

const WarehouseDetails: FC<WarehouseDetailsProps> = ({ statement }) => {
    const [itemName, setItemName] = useState<string>('');
    const [itemPrice, setItemPrice] = useState<number>();
    const [itemId, setItemId] = useState<number>();

    const [itemNewName, setItemNewName] = useState<string>('');
    const [itemNewPrice, setItemNewPrice] = useState<number>();

    const [loading, isLoading] = useState<boolean>(false);

    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const storeItems = useAppSelector((store) => store.store.items);
    const warehouseSelectedItem = useAppSelector((store) => store.warehouse.item);

    const [itemCounts, setItemCounts] = useState<Record<number, number>>({});

    useEffect(() => {
        fetchWarehouseItem(warehouseSelectedItem)
            .then(res => {
                const { id, name, price } = res;
                setItemId(id);
                setItemName(name);
                setItemPrice(price);
            })
            .catch(error => {
                console.log({ error });
            });
    }, [])

    const handleAddItem = () => {
        fetchWarehouseAddItem(itemName, itemPrice)
            .then(res => {
                setFinish(true);
                setFinishDescription(`Товар "${itemName}" по цене ${itemPrice} руб. успешно добавлен на склад`);
                // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                setError(true)
                // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }

    const handleAddSupply = () => {
        const selectedItems = [];
        for (const itemId in itemCounts) {
            if (itemCounts[itemId] > 0) {
                selectedItems.push({ id: Number(itemId), qty: itemCounts[itemId] });
            }
        }

        fetchWarehouseAddSupply(selectedItems)
            .then(res => {
                setFinish(true);
                setFinishDescription(`Приход товаров успешно добавлен`);
                // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                setError(true)
                // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }

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

    const handleEditItem = () => {
        if (itemNewName) {
            fetchWarehouseEditItemName(itemId, itemNewName)
                .then(res => {
                    setFinish(true);
                    setFinishDescription(`Название товара успешно изменено`);
                    // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
                })
                .catch(error => {
                    setError(true)
                    // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
                });
        }
        if (itemNewPrice) {
            fetchWarehouseEditItemPrice(itemId, itemNewPrice)
                .then(res => {
                    setFinish(true);
                    setFinishDescription(`Стоимость товара успешно изменена`);
                    // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
                })
                .catch(error => {
                    setError(true)
                    // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
                });
        }
    }

    const handleHideItem = () => {
        fetchWarehouseHideItem(itemId)
            .then(res => {
                setFinish(true);
                setFinishDescription(`Товар успешно удален`);
                // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                setError(true)
                // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }
    const handleShowItem = () => {
        fetchWarehouseShowItem(itemId)
            .then(res => {
                setFinish(true);
                setFinishDescription(`Товар успешно восстановлен`);
                // dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                setError(true)
                // dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
    }



    const detailsBody = () => {
        if (finish) {
            return (
                <>
                    <p className={styles.mt4}>{finishDescription}</p>
                </>
            )
        }

        if (error) {
            return (
                <>
                    <h2>Неопознанная Ошибка!</h2>
                    <p>Запиши свои действия и опиши проблеум программисту!</p>
                </>
            )
        }

        switch (statement) {
            case "addItem":
                return (
                    <ul className={styles.cardList}>
                        <li className={styles.listItem}>
                            <p className={styles.listText}>Название товара</p>
                        </li>

                        <li className={styles.listItem}>
                            <input className={styles.listInput} type="text" value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder='Название товара' />
                        </li>

                        <li className={styles.listItem}>
                            <p className={styles.listText}>Стоимость товара</p>
                        </li>

                        <li className={styles.listItem}>
                            <input className={styles.listInput} type="text" value={itemPrice} onChange={(event) => setItemPrice(Number(event.target.value))} placeholder='Стоимость товара' />
                        </li>

                        <li className={`${styles.listItem} ${styles.mt4}`}>
                            <button className={styles.listInputSubmit} onClick={handleAddItem}>Добавить</button>
                        </li>
                    </ul>
                )
            case "addSupply":
                return (
                    <>
                        <ul className={`${styles.cardList} ${styles.cardScroll}`}>
                            {storeItems.map((item: TStoreItem) => {
                                return (
                                    <li className={`${styles.listItem} ${styles.alignLeft}`} key={item.id}>
                                        {item.name}
                                        <button className={styles.symbolsCircle} onClick={() => handleDecrement(item.id)}>-</button>
                                        {itemCounts[item.id] || 0}
                                        <button className={styles.symbolsCircle} onClick={() => handleIncrement(item.id)}>+</button>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className={`${styles.mt4}`}>
                            <button className={styles.listInputSubmit} onClick={handleAddSupply}>Подтвердить приход товаров</button>
                        </div>
                    </>
                )
            case "editItem":
                return (
                    <>
                        {!loading
                            ? <>
                                <ul className={`${styles.cardList} ${styles.cardScroll}`}>

                                    <li className={`${styles.listItem} ${styles.flexBetween} ${styles.alignLeft}`}>
                                        <p>Старое название</p>
                                        <input className={`${styles.listInput} ${styles.ml2}`} type="text" value={itemName} disabled />
                                    </li>

                                    <li className={`${styles.listItem} ${styles.flexBetween} ${styles.alignLeft}`}>
                                        <p>Новое название</p>
                                        <input className={`${styles.listInput} ${styles.ml2}`} type="text" value={itemNewName} onChange={(event) => setItemNewName(event.target.value)} placeholder='Новое название' />
                                    </li>

                                    <li className={`${styles.listItem} ${styles.flexBetween} ${styles.alignLeft} ${styles.mt4}`}>
                                        <p>Старая цена</p>
                                        <input className={`${styles.listInput} ${styles.ml2}`} type="text" value={itemPrice} disabled />
                                    </li>

                                    <li className={`${styles.listItem} ${styles.flexBetween} ${styles.alignLeft}`}>
                                        <p>Новая цена</p>
                                        <input className={`${styles.listInput} ${styles.ml2}`} type="text" value={itemNewPrice} onChange={(event) => setItemNewPrice(Number(event.target.value))} placeholder='Стоимость товара' />
                                    </li>

                                </ul>
                                <div className={`${styles.mt4}`}>
                                    <p>Если не нужно менять один из параметров, оставь поле пустым</p>
                                </div>

                                <div className={`${styles.mt4}`}>
                                    <button className={styles.listInputSubmit} onClick={handleEditItem}>Подтвердить изменение</button>
                                </div>
                            </>
                            : <>
                                Подождите идет загрузка!
                            </>}
                    </>
                )
            case "hideItem":
                return (
                    <>
                        <div className={`${styles.mt4}`}>
                            <button className={styles.listInputSubmit} onClick={handleHideItem}>Подтвердить удаление</button>
                        </div>
                    </>
                )
            case "showItem":
                return (
                    <div className={`${styles.mt4}`}>
                        <button className={styles.listInputSubmit} onClick={handleShowItem}>Подтвердить восстановление</button>
                    </div>
                )
            default:
                return (
                    <p className={styles.mt4}>Данная опиця не найдена</p>
                )
                break;
        }
    }

    return (
        <article>
            <div className={styles.card}>
                {detailsBody()}
            </div>
        </article>
    );
}

export default WarehouseDetails;