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
import { ADD_ITEM, ADD_SUPPLY, EDIT_ITEM, HIDE_ITEM, REMOVE_ITEM, SHOW_ITEM, WRITE_OFF } from '../../utils/constants';
export const Warehouse: FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading,] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [, setTotalPrice] = useState<number>(0);
    const [statement, setStatement] = useState<string>('');
    const storeItems = useAppSelector((store) => store.store.items);

    const sortStoreItems = storeItems && storeItems.sort((a: TStoreItem, b: TStoreItem) => {
        // Первым делом проверяем значение hide
        if (a.hide && !b.hide) {
            return 1; // a.hide идет после b.hide
        }
        if (!a.hide && b.hide) {
            return -1; // a.hide идет перед b.hide
        }

        // Если значения hide одинаковы или отсутствуют,
        // сравниваем значения qty
        return b.qty - a.qty; // сортируем по убыванию qty
    });
    const [error,] = useState<boolean>(false);
    const [errorDesription,] = useState<string>('');

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

    const handleWriteOffClick = () => {
        setModalOpen(true)
        setStatement(WRITE_OFF)
    }

    return (
        <>
            <article className={`${styles.container} mt-1`}>
                <div className={`${styles.card} flexBetween`}>
                    <table className={`${styles.table} table`}>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Стоимость, руб.</th>
                                <th>Количество, шт.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortStoreItems.map((item: TStoreItem) => (
                                <tr
                                    key={item.id}
                                    className={`
                                                ${item.hide ? styles.hideRow : styles.nonHideRow} 
                                                ${selectedItems.includes(item.id) ? styles.selectedRow : ""}
                                            `}
                                    onClick={() => handleItemClick(item.id)}
                                >
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <button className='buttonDefault mr-1' onClick={handleAddItemClick}>Добавить новый товар</button>
                        <button className='buttonDefault mr-1' onClick={handleAddSupplyClick}>Приход товара</button>
                        <button className='buttonDefault' onClick={handleWriteOffClick}>Списание</button>
                    </div>
                </div>

                <div className={`${styles.card}`}>
                    <div>
                        <h3 className='whiteMessage'>Редактировать</h3>
                        {selectedItems.length > 0 ? (
                            <ul>
                                {selectedItems.map((itemId) => {
                                    const item: TStoreItem = storeItems.find((item: TStoreItem) => item.id === itemId);
                                    return (
                                        <li key={item.id} className='mt-2'>
                                            <p>Название: <span className='link'>{item.name}</span></p>
                                            <p>Стоимость: <span className='link'>{item.price}</span> руб.</p>
                                            <p>Кол-во: <span className='link'>{item.qty}</span> шт.</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : error
                            ? <p className='errorMessage'>{errorDesription}</p> : <p className='mt-2'>Товар не выбран</p>
                        }
                    </div>

                    <div>
                        {selectedItems.map((itemId) => {
                            const item: TStoreItem = storeItems.find((item: TStoreItem) => item.id === itemId);

                            return (
                                <div key={item.id}>
                                    {item.hide
                                        ? <button className='buttonDefault restoreDefault w-100' onClick={handleShowItemClick} disabled={selectedItems.length === 0}>
                                            Восстановить
                                        </button>
                                        : <button className='buttonDefault dangerDefault w-100' onClick={handleHideItemClick} disabled={selectedItems.length === 0}>
                                            Удалить
                                        </button>
                                    }
                                </div>
                            )
                        })}

                        <button className='buttonDefault w-100 mt-1' onClick={handleEditItemClick} disabled={selectedItems.length === 0}>
                            Изменить
                        </button>
                    </div>
                </div>

            </article>

            {isLoading && (
                <Modal onClose={closeModal}>
                    <div>
                        <h1>Оформляем заказ</h1>
                        <p>
                            Подождите пожалуйста, примерное время ожидание 15 сек.
                        </p>
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            size="5x"
                        />
                    </div>
                </Modal>
            )}

            {isModalOpen && (
                <Modal onClose={closeModal} header={
                    statement === ADD_ITEM
                        ? "Добавить новый товар"
                        : statement === ADD_SUPPLY
                            ? "Приход товаров"
                            : statement === EDIT_ITEM
                                ? "Изменение товара"
                                : statement === REMOVE_ITEM
                                    ? "Удаление товара"
                                    : statement === HIDE_ITEM
                                        ? "Удалить товар"
                                        : statement === SHOW_ITEM
                                            ? "Восстановить товар"
                                            : statement === WRITE_OFF
                                                ? "Списание товара" : "Новое окно"
                }>
                    <WarehouseDetails statement={statement} />
                </Modal >
            )}
        </>
    );
};