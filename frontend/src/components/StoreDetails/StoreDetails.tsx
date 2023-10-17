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
                <h2 className='whiteMessage'>{finishDescription}</h2>
            )
        }

        if (error) {
            return (
                <>
                    <h2 className='whiteMessage'>Неопознанная Ошибка!</h2>
                    <p className='whiteMessage'>Запиши свои действия и опиши проблеум программисту!</p>
                </>
            )
        }

        switch (statement) {
            case STORE_OPEN_CART:
                return (
                    <>
                        <ul className={`${styles.cartBody} scrollable`}>
                            {selectedProducts.map((item: any) => (
                                <li key={item.id} className={`${styles.cartItem} mt-1 activeLink`}>
                                    <p className={styles.name}>{item.name}</p>
                                    <p className={`circle blackMessage`}>{item.qty}</p>
                                </li>
                            ))}
                        </ul>
                        <p>Способ оплаты: <span className='link'>{payment === CASH ? "Наличный" : "Безналичный"}</span></p>

                        <button className='buttonDefault mt-1' onClick={() => handleAcceptClick(selectedProducts, payment)}>
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
                        <div>
                        </div>
                        <div>
                            <p className={`${styles.textOrangeColor}`}>
                                Пожалуйста подождите
                            </p>
                            <div className={`${styles.flex}`}>
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