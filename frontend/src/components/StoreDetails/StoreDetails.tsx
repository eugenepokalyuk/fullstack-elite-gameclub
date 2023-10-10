import { FC, useState } from 'react';
import styles from './StoreDetails.module.css';
// import { StoreDetailsProps, TComputer } from '../../services/types/types';
import { fetchContinue, fetchEditComputerName, fetchFinish, fetchPause, fetchPlay, fetchRemoveComputer, fetchStoreSell } from '../../utils/api';
import { COMPUTER_STATUS_PLAY, COMPUTER_STATUS_PAUSE, COMPUTER_STATUS_CONTINUE, COMPUTER_STATUS_PLAYING, COMPUTER_STATUS_SETTINGS, STORE_OPEN_CART, CASH } from '../../utils/constants';
import { PaymentSwitcher } from '../PaymentSwitcher/PaymentSwitcher';
import { useAppSelector } from '../../services/hooks/hooks';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { TStoreItem } from '../../services/types/types';
import { STORE_PATH } from '../../utils/routePath';

type TStoreDetails = {
    selectedItems: {
        items: TStoreItem[],
        payment: string
    }
    statement: string
}

const StoreDetails: FC<TStoreDetails> = ({ selectedItems, statement }) => {
    const [finish, setFinish] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const navigate = useNavigate();
    const [loading, isLoading] = useState<boolean>(false);

    const closeModal = () => {
        navigate(-1);
    };

    const handleAcceptClick = (item: any) => {
        isLoading(true);
        fetchStoreSell(item)
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
                            {selectedItems.items.map((item: any) => (
                                <li key={item.id} className={styles.cartItem}>
                                    <p>{item.name}</p>
                                    <p>{item.qty}</p>
                                </li>
                            ))}
                        </ul>
                        <p className={`${styles.alignLeft}`}>Способ оплаты: <span className={styles.selectedText}>{selectedItems.payment === CASH ? "Наличный" : "Безналичный"}</span></p>

                        <button onClick={() => handleAcceptClick(selectedItems)}>
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