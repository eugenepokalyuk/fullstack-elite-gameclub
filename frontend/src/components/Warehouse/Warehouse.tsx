import React, { FC, useState, useEffect } from 'react';
import styles from "./Warehouse.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { TStoreItem } from '../../services/types/types';
import { FETCH_STORE_FAILURE, FETCH_STORE_REQUEST, FETCH_STORE_SUCCESS } from '../../services/actions/store';
import Modal from '../Modal/Modal';
import WarehouseDetails from '../WarehouseDetails/WarehouseDetails';
import { fetchStoreData } from '../../utils/api';
import { SELECT_WAREHOUSE_REQUEST, SELECT_WAREHOUSE_SUCCESS } from '../../services/actions/warehouse';
import { ADD_ITEM, ADD_SUPPLY, EDIT_ITEM, HIDE_ITEM, SHOW_ITEM } from '../../utils/constants';

export const Warehouse: FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading,] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [, setTotalPrice] = useState<number>(0);
    const [statement, setStatement] = useState<string>('');
    const storeItems = useAppSelector((store) => store.store.items);

    const closeModal = () => {
        dispatch({ type: FETCH_STORE_REQUEST });
        fetchStoreData()
            .then(res => {
                dispatch({ type: FETCH_STORE_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_STORE_FAILURE, payload: error });
            });
        setModalOpen(false);
    };

    useEffect(() => {
        // При изменении выбранных товаров пересчитываем общую стоимость
        const selectedProducts = storeItems.filter((item: TStoreItem) => selectedItems.includes(item.id));
        const price = selectedProducts.reduce((total: number, product: TStoreItem) => total + product.price, 0);
        setTotalPrice(price);
    }, [selectedItems, storeItems]);

    const handleItemClick = (itemId: any) => {
        dispatch({ type: SELECT_WAREHOUSE_REQUEST });
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            dispatch({ type: SELECT_WAREHOUSE_SUCCESS, payload: itemId });
            setSelectedItems([itemId]);
        }
    };

    const handleAddItemClick = () => {
        setModalOpen(true)
        setStatement(ADD_ITEM)
    }

    const handleAddSupplyClick = () => {
        setModalOpen(true)
        setStatement(ADD_SUPPLY)
    }

    const handleEditItemClick = () => {
        setModalOpen(true)
        setStatement(EDIT_ITEM)
    }

    const handleHideItemClick = () => {
        setModalOpen(true)
        setStatement(HIDE_ITEM)
    }
    const handleShowItemClick = () => {
        setModalOpen(true)
        setStatement(SHOW_ITEM)
    }

    return (
        <>
            <article className={`${styles.mt4}`}>

                <div>
                    <button className={`${styles.mr4}`} onClick={handleAddItemClick}>Добавить новый товар</button>
                    <button className={`${styles.mr4}`} onClick={handleAddSupplyClick}>Приход товара</button>
                </div>

                <div className={`${styles.storeContainer} ${styles.mt4}`}>
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
                            <h2>Редактировать</h2>
                        </div>

                        <div className={styles.cartBody}>
                            {selectedItems.length > 0 ? (
                                <ul>
                                    {selectedItems.map((itemId) => {
                                        const item: TStoreItem = storeItems.find((item: TStoreItem) => item.id === itemId);
                                        return (
                                            <li key={item.id}>
                                                <p>Название: <span className={styles.selectedOption}>{item.name}</span></p>
                                                <p>Стоимость: <span className={styles.selectedOption}>{item.price}</span></p>
                                                <p>Кол-во: <span className={styles.selectedOption}>{item.qty}</span></p>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <p>Выбери товар</p>
                            )}
                        </div>

                        <div className={styles.cartFooter}>
                            {selectedItems.map((itemId) => {
                                const item: TStoreItem = storeItems.find((item: TStoreItem) => item.id === itemId);

                                return (
                                    <div key={item.id}>
                                        {item.hide
                                            ? <button className={`${styles.deleteButton} ${styles.mt2}`} onClick={handleShowItemClick} disabled={selectedItems.length === 0}>
                                                Восстановить
                                            </button>
                                            : <button className={`${styles.deleteButton} ${styles.mt2}`} onClick={handleHideItemClick} disabled={selectedItems.length === 0}>
                                                Удалить
                                            </button>
                                        }
                                    </div>
                                )
                            })}

                            <button className={`${styles.submitButton} ${styles.mt2}`} onClick={handleEditItemClick} disabled={selectedItems.length === 0}>
                                Изменить
                            </button>
                        </div>

                    </div>
                </div>

            </article>

            {isLoading && (
                <Modal onClose={closeModal}>
                    <div className={styles.modalContent}>
                        <h1 className="text text_type_main-large mb-8">Оформляем заказ</h1>
                        <p className="text text_type_main-medium text_color_inactive mb-8">
                            Подождите пожалуйста, примерное время ожидание 15 сек.
                        </p>
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            size="5x"
                            className={`${styles.faSpinner}`}
                        />
                    </div>
                </Modal>
            )}

            {isModalOpen && (
                <Modal onClose={closeModal} header={
                    statement === "addItem"
                        ? "Добавить новый товар"
                        : statement === "addSupply"
                            ? "Приход товаров"
                            : statement === "editItem"
                                ? "Изменение товара"
                                : statement === "removeItem"
                                    ? "Удаление товара"
                                    : statement === "hideItem"
                                        ? "Удалить товар"
                                        : statement === "showItem"
                                            ? "Восстановить товар" : "Новое окно"
                }>
                    <WarehouseDetails statement={statement} />
                </Modal >
            )}
        </>
    );
};