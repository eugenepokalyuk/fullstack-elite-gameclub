import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { TStoreItem } from '../../services/types/types';
import { STORE_OPEN_CART } from '../../utils/constants';
import Modal from '../Modal/Modal';
import { PaymentSwitcher } from '../PaymentSwitcher/PaymentSwitcher';
import StoreDetails from '../StoreDetails/StoreDetails';
import styles from "./Store.module.css";

export const Store: FC = () => {
    const dispatch = useAppDispatch();

    const storeItems = useAppSelector((store) => store.store.items.filter((item: any) => item.qty > 0 && item.hide === false));

    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
    const [error,] = useState<boolean>(false);
    const [errorDesription,] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [statement, setStatement] = useState<string>('');
    const paymentType = useAppSelector((store) => store.payment.paymentType)

    const closeModal = () => {
        setModalOpen(false)
    };
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
            [itemId]: (prevCounts[itemId] || 1) + 1
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
        // eslint-disable-next-line
    }, [selectedItems, dispatch, itemCounts]);

    let qty = 0;

    const selectedProducts = storeItems.filter((item: TStoreItem) => selectedItems.includes(item.id))
        .map((item: TStoreItem) => {
            qty = itemCounts[item.id] || 1;
            return { ...item, qty };
        });

    const handleAddToCart = async () => {
        setModalOpen(true);
        setStatement(STORE_OPEN_CART);
        // setSelectedItems([]);
    }

    return (
        <>
            <article className={styles.container}>
                <div className={`${styles.card}`}>
                    <table className={`${styles.table} table`}>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Стоимость, руб.</th>
                                <th>Количество, шт.</th>
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

                <div className={`${styles.card}`}>
                    <div>
                        <h3 className='whiteMessage'>Корзина</h3>
                        {selectedItems.length > 0 ? (
                            <ul className={`${styles.minHeight50} scrollable`}>
                                {selectedItems.map((itemId) => {
                                    const item = storeItems.find((item: TStoreItem) => item.id === itemId);
                                    return (
                                        <li key={itemId} className={`${styles.cardList} mt-1 whiteMessage activeLink`}>
                                            {item.name}
                                            <div>
                                                <button className='smallIncrementButton' onClick={() => handleDecrement(item.id)}>
                                                    -
                                                </button>

                                                {itemCounts[item.id] || 1}

                                                <button className='smallIncrementButton' onClick={() => handleIncrement(item.id)}>
                                                    +
                                                </button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )
                            : error
                                ? <p className='errorMessage'>{errorDesription}</p> : <p className='mt-2'>Корзина пуста</p>
                        }
                    </div>

                    <div>
                        <PaymentSwitcher />
                        <button className='flex flexCenter buttonDefault mt-1 w-100' onClick={handleAddToCart} disabled={selectedItems.length === 0 || !paymentType}>
                            {/*  */}
                            Оплатить
                            <span className='ml-1'>
                                {totalPrice} руб.
                            </span>
                        </button>
                    </div>
                </div>
            </article >

            {isModalOpen && storeItems && (
                <Modal onClose={closeModal} header={"Корзина"}>
                    <StoreDetails statement={statement} selectedProducts={selectedProducts} payment={paymentType} setSelectedItems={setSelectedItems} />
                </Modal>
            )
            }
        </>
    );
};