import { FC, useEffect, useState } from 'react';
import styles from './WarehouseDetails.module.css';
import { useAppSelector } from '../../services/hooks/hooks';
import { TStoreItem, WarehouseDetailsProps } from '../../services/types/types';
import { fetchWarehouseAddItem, fetchWarehouseAddSupply, fetchWarehouseEditItemName, fetchWarehouseEditItemPrice, fetchWarehouseHideItem, fetchWarehouseItem, fetchWarehouseShowItem } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const WarehouseDetails: FC<WarehouseDetailsProps> = ({ statement }) => {
    const [itemName, setItemName] = useState<string>('');
    const [itemPrice, setItemPrice] = useState<number>();
    const [itemId, setItemId] = useState<number>();
    const [itemNewName, setItemNewName] = useState<string>('');
    const [itemNewPrice, setItemNewPrice] = useState<number>();
    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const storeItems = useAppSelector((store) => store.store.items);
    const warehouseSelectedItem = useAppSelector((store) => store.warehouse.item);
    const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
    const navigate = useNavigate();
    const [loading, isLoading] = useState<boolean>(false);

    const closeModal = () => {
        navigate(-1);
    };

    useEffect(() => {
        isLoading(true);
        fetchWarehouseItem(warehouseSelectedItem)
            .then(res => {
                isLoading(false);
                const { id, name, price } = res;
                setItemId(id);
                setItemName(name);
                setItemPrice(price);
            })
            .catch(error => {
                // console.log({ error });
            });
    }, [])

    const handleAddItem = () => {
        isLoading(true);
        fetchWarehouseAddItem(itemName, itemPrice)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription(`Товар "${itemName}" по цене ${itemPrice} руб. успешно добавлен на склад`);
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleAddSupply = () => {
        const selectedItems = [];
        for (const itemId in itemCounts) {
            if (itemCounts[itemId] > 0) {
                selectedItems.push({ id: Number(itemId), qty: itemCounts[itemId] });
            }
        }
        isLoading(true);
        fetchWarehouseAddSupply(selectedItems)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription(`Приход товаров успешно добавлен`);
            })
            .catch(error => {
                setError(true)
            });
    }

    const handleIncrement = (itemId: number, number: number) => {
        setItemCounts((prevCounts) => ({
            ...prevCounts,
            [itemId]: (prevCounts[itemId] || 0) + number
        }));
    };

    const handleDecrement = (itemId: number, number: number) => {
        setItemCounts((prevCounts) => {
            const currentCount = prevCounts[itemId] || 0;
            const updatedCount = Math.max(0, currentCount - number);
            return {
                ...prevCounts,
                [itemId]: updatedCount
            };
        });
    };

    const handleEditItem = () => {
        if (itemNewName) {
            isLoading(true);

            fetchWarehouseEditItemName(itemId, itemNewName)
                .then(res => {
                    isLoading(false);
                    setFinish(true);
                    setFinishDescription(`Название товара успешно изменено`);
                })
                .catch(error => {
                    setError(true)
                });
        }
        if (itemNewPrice) {
            isLoading(true);

            fetchWarehouseEditItemPrice(itemId, itemNewPrice)
                .then(res => {
                    isLoading(false);
                    setFinish(true);
                    setFinishDescription(`Стоимость товара успешно изменена`);
                })
                .catch(error => {
                    setError(true)
                });
        }
    }

    const handleHideItem = () => {
        isLoading(true);
        fetchWarehouseHideItem(itemId)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription(`Товар успешно удален`);
            })
            .catch(error => {
                setError(true)
            });
    }
    const handleShowItem = () => {
        isLoading(true);
        fetchWarehouseShowItem(itemId)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription(`Товар успешно восстановлен`);
            })
            .catch(error => {
                setError(true)
            });
    }

    const detailsBody = () => {
        if (finish) {
            return (
                <p className={styles.mt4}>{finishDescription}</p>
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
                                    <li className={`${styles.listItem} ${styles.supplyContainer} ${styles.alignLeft}`} key={item.id}>
                                        <div className={styles.containerTitle}>
                                            {item.name}
                                        </div>
                                        <div className={styles.containerCounter}>
                                            <div className={styles.symbolsCircleContainer}>
                                                <button className={styles.symbolsCircle} onClick={() => handleDecrement(item.id, 5)}>-5</button>
                                                <button className={styles.symbolsCircle} onClick={() => handleDecrement(item.id, 1)}>-</button>
                                            </div>
                                            {itemCounts[item.id] || 0}
                                            <div className={styles.symbolsCircleContainer}>
                                                <button className={styles.symbolsCircle} onClick={() => handleIncrement(item.id, 1)}>+</button>
                                                <button className={styles.symbolsCircle} onClick={() => handleIncrement(item.id, 5)}>+5</button>
                                            </div>
                                        </div>
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
        }
    }

    return (
        <article>
            {!loading
                ? <div className={styles.card}>
                    {detailsBody()}
                </div>
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
        </article>
    );
}

export default WarehouseDetails;