import { ChangeEvent, FC, useEffect, useState } from 'react';
import styles from './WarehouseDetails.module.css';
import { useAppSelector } from '../../services/hooks/hooks';
import { TStoreItem, TWriteOff, WarehouseDetailsProps } from '../../services/types/types';
import { fetchGetUsers, fetchStoreWriteOff, fetchWarehouseAddItem, fetchWarehouseAddSupply, fetchWarehouseEditItemName, fetchWarehouseEditItemPrice, fetchWarehouseHideItem, fetchWarehouseItem, fetchWarehouseShowItem } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faWarning } from '@fortawesome/free-solid-svg-icons';
import { ADD_ITEM, ADD_SUPPLY, EDIT_ITEM, HIDE_ITEM, SHOW_ITEM, WRITE_OFF } from '../../utils/constants';

interface TEmployee {
    name: string;
    uuid: string;
}

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

    const [selectedItem, setSelectedItem] = useState<number>();
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [employees, setEmployees] = useState<TEmployee[]>([]);
    const [selectedCount, setSelectedCount] = useState<number>();

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
            });
    }, [])
    useEffect(() => {
        if (selectedReason !== 'Сотрудник') {
            setEmployees([]);
        }
    }, [selectedReason]);

    const handleSelectPersonChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedEmployee(e.target.value);
    }
    const handleSelectItemChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedItem(Number(e.target.value));
    }
    const handleSelectCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedCount(Number(e.target.value));
    }
    const handleReasonChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedReason(e.target.value);
        setSelectedEmployee('');

        if (e.target.value === 'Сотрудник') {
            try {
                await fetchGetUsers()
                    .then(res => {
                        setEmployees(res);
                    })
                    .catch(error => {
                        setError(true)
                    });
            } catch (error) {
                setError(true)
                console.error('Ошибка при получении данных сотрудников:', error);
                // Обработка ошибки при получении данных сотрудников
            }
        }
    };
    const handleConfirmClick = () => {
        const writeOffType = selectedReason === 'Срок годности' ? 'exp' : selectedReason === 'Сотрудник' ? 'person' : undefined;

        const dataExp: TWriteOff = {
            type: writeOffType,
            details: {
                id: selectedItem,
                qty: selectedCount
            }
        }

        const dataPerson: TWriteOff = {
            type: writeOffType,
            details: {
                id: selectedItem,
                qty: selectedCount,
                name: selectedEmployee
            }
        }

        isLoading(true);
        fetchStoreWriteOff(writeOffType === "exp" ? dataExp : dataPerson)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription(`Товар успешно списан`);
            })
            .catch(error => {
                setError(true)
            });
    };

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
    const handleChangeItemCount = (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
        // setItemCounts(Number(e.target.value));
        // setItemCounts(e.target.value);

        setItemCounts((prevCounts) => ({
            ...prevCounts,
            [itemId]: (prevCounts[itemId] || 0) + Number(e.target.value)
        }));
    }
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
            case ADD_ITEM:
                return (
                    <ul className={`${styles.cardList} flex flexColumn flexCenter`}>
                        <li>
                            <p>Название товара</p>
                            <input className='inputDefault mt-1' type="text" value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder='Название товара' />
                        </li>

                        <li className='mt-1'>
                            <p>Стоимость товара</p>
                            <input onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }} className='inputDefault mt-1' type="text" value={itemPrice} onChange={(event) => setItemPrice(Number(event.target.value))} placeholder='Стоимость товара' />
                        </li>

                        <li className='mt-1'>
                            <button className="buttonDefault" onClick={handleAddItem}>Добавить</button>
                        </li>
                    </ul>
                )
            case ADD_SUPPLY:
                return (
                    <>
                        {storeItems.length > 0
                            ? <>
                                <ul className='flex flexColumn marginAuto w-65 scrollable'>
                                    {storeItems.map((item: TStoreItem) => {
                                        return item && !item.hide && (
                                            <li key={item.id} className={`${styles.suppliesList}`}>
                                                <p className='mr-2'>{item.name}</p>
                                                <div className='flex flexAlignCenter flexCenter'>
                                                    <input onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }} className='inputDefault mt-1' type="text" onChange={e => handleChangeItemCount(e, item.id)} placeholder='Кол-во' />
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                                <div>
                                    <button className="buttonDefault w-30 mt-2" onClick={handleAddSupply}>Подтвердить приход товаров</button>
                                </div>
                            </>
                            : <p>
                                Сначала нужно добавить товары
                            </p>
                        }

                    </>
                )
            case EDIT_ITEM:
                return (
                    <>
                        <ul className='flex flexColumn flexCenter'>

                            <li className='mt-1'>
                                <p>Старое название</p>
                                <input className='inputDefault mt-1' type="text" value={itemName} disabled />
                            </li>

                            <li className='mt-1'>
                                <p>Новое название</p>
                                <input className='inputDefault mt-1' type="text" value={itemNewName} onChange={(event) => setItemNewName(event.target.value)} placeholder='Новое название' />
                            </li>

                            <li className='mt-1'>
                                <p>Старая цена</p>
                                <input className='inputDefault mt-1' type="text" value={itemPrice} disabled />
                            </li>

                            <li className='mt-1'>
                                <p>Новая цена</p>
                                <input onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }} className='inputDefault mt-1' type="text" value={itemNewPrice} onChange={(event) => setItemNewPrice(Number(event.target.value))} placeholder='Стоимость товара' />
                            </li>

                        </ul>

                        <button className="buttonDefault mt-2" onClick={handleEditItem}>Подтвердить изменение</button>
                    </>
                )
            case HIDE_ITEM:
                return (
                    <>
                        <div>
                            <button className="buttonDefault w-30" onClick={handleHideItem}>Подтвердить удаление</button>
                        </div>
                    </>
                )
            case SHOW_ITEM:
                return (
                    <div>
                        <button className="buttonDefault w-30" onClick={handleShowItem}>Подтвердить восстановление</button>
                    </div>
                )
            case WRITE_OFF:
                const isButtonDisabled = !selectedItem || !selectedReason || !selectedCount || (selectedReason === 'Сотрудник' && !selectedEmployee);
                return (
                    <>
                        {storeItems.length > 0
                            ? <>
                                <div className='flex flexColumn flexCenter marginAuto w-50'>
                                    <select className='selectDefault w-100' onChange={handleSelectItemChange}>
                                        <option value="">--</option>
                                        {storeItems.map((item: TStoreItem) => {
                                            return (
                                                item.qty > 0 && <option key={item.id} value={item.id}>{item.name}</option>
                                            )
                                        })}
                                    </select>

                                    <select className='selectDefault w-100' onChange={handleReasonChange}>
                                        <option value="">--</option>
                                        <option>Срок годности</option>
                                        <option>Сотрудник</option>
                                    </select>

                                    {selectedReason === 'Сотрудник' && (
                                        <select className='selectDefault w-100' onChange={handleSelectPersonChange}>
                                            <option value="">--</option>
                                            {employees.map((employee: TEmployee) => {
                                                return <option key={employee.uuid}>{employee.name}</option>;
                                            })}
                                        </select>
                                    )}

                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        onChange={handleSelectCountChange}
                                        className='inputNumberDefault w-95'
                                        placeholder='Кол-во'
                                    />

                                    < button
                                        className="buttonDefault mt-1 w-50"
                                        onClick={handleConfirmClick}
                                        disabled={isButtonDisabled}
                                    >
                                        Подтвердить списание
                                    </button>
                                </div>
                            </>
                            : <p>
                                Сначала нужно добавить товары
                            </p>
                        }
                    </>
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
                : error
                    ? <Modal onClose={closeModal} header="Ошибка загрузки данных">
                        <div>
                            <p className={`${styles.textOrangeColor}`}>
                                Действие не выполнено, закройте окно
                            </p>
                            <div className={`${styles.flex}`}>
                                <FontAwesomeIcon
                                    icon={faWarning}
                                    size="5x"
                                    className={`${styles.faSpinner}`}
                                />
                            </div>
                        </div>
                    </Modal>
                    : <Modal onClose={closeModal} header="Загрузка данных">
                        <div>
                            <p className={`${styles.textOrangeColor}`}>
                                Пожалуйста подождите
                            </p>
                            <div className={`${styles.flex}`}>
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    spin
                                    size="5x"
                                    className="faSpinner"
                                />
                            </div>
                        </div>
                    </Modal>
            }
            {/* {!error && <>Ошибка</>} */}
        </article>
    );
}

export default WarehouseDetails;