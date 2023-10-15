import { FC, useState } from 'react';
import styles from './StoreDetails.module.css';
import { fetchStoreSell } from '../../utils/api';
import { STORE_OPEN_CART, CASH } from '../../utils/constants';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { TStoreItem } from '../../services/types/types';

type TStoreDetails = {
    selectedProducts: TStoreItem[],
    payment: string,
    statement: string
}

const StoreDetails: FC<TStoreDetails> = ({ statement, selectedProducts, payment }) => {
    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const navigate = useNavigate();
    const [loading, isLoading] = useState<boolean>(false);

    const closeModal = () => {
        navigate(-1);
    };

    const handleAcceptClick = (products: any, payment: string) => {
        isLoading(true);
        fetchStoreSell(products, payment)
            .then(res => {
                isLoading(false);
                setFinish(true);
                setFinishDescription("Продано!");
            })
            .catch(error => {
                setError(true);
            });
    }

    const detailsBody = () => {
        if (finish) {
            return (
                <h2>{finishDescription}</h2>
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
            case STORE_OPEN_CART:
                return (
                    <>
                        <ul className={styles.cartBody}>
                            {selectedProducts.map((item: any) => (
                                <li key={item.id} className={styles.cartItem}>
                                    <p className={styles.name}>{item.name}</p>
                                    <p className={styles.qty}>{item.qty}</p>
                                </li>
                            ))}
                        </ul>
                        <p
                            className={`${styles.alignLeft}`}
                        >
                            Способ оплаты: <span className={styles.selectedText}>{payment === CASH ? "Наличный" : "Безналичный"}</span>
                        </p>

                        <button className={styles.button} onClick={() => handleAcceptClick(selectedProducts, payment)}>
                            Подтвердить
                        </button>
                    </>
                )
            default:
                break;
        }
    }

    return (
        <article>
            <div className={styles.card}>
                {!loading
                    ? detailsBody()
                    : <Modal onClose={closeModal} header="Загрузка данных">
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
                    </Modal>}
            </div>
        </article>
    );
}

export default StoreDetails;