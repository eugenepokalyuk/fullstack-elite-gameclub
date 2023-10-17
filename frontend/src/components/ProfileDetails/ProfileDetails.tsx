import { FC, useState } from 'react';
import styles from './ProfileDetails.module.css';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { clearUser } from '../../services/actions/auth';
import { fetchUserFinish } from '../../utils/api';
import { TUser } from '../../services/types/types';

const ProfileDetails: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loading, isLoading] = useState<boolean>(false);
    const user: TUser = useAppSelector((store) => store.auth.user);

    const closeModal = () => {
        navigate(-1);
    };

    const handleCloseSession = () => {
        localStorage.clear();
        dispatch(clearUser());
        fetchUserFinish(user.uuid, user.sessionId)
            .then((res) => {
                isLoading(true);
                navigate("/login", { replace: true });
            })
            .catch((error) => {
                // setError("Ой, произошла ошибка!");
            });
    }
    return (
        <article>
            <div className={styles.card}>
                {!loading
                    ?
                    <ul className={styles.card}>
                        <li className={`${styles.cardItem} whiteMessage mt-1`}>
                            Имя сотрудника: <span className='link'>{user.name}</span>
                        </li>

                        <li className={styles.cardItem}>
                            <button
                                className='buttonDefault mt-2'
                                onClick={handleCloseSession}
                            >
                                Закончить смену
                            </button>
                        </li>
                    </ul>
                    : <Modal onClose={closeModal} header='Загрузка данных'>
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
            </div>
        </article>
    );
}

export default ProfileDetails;