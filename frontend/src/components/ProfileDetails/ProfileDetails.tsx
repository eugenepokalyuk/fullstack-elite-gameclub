import { FC, useState } from 'react';
import styles from './ProfileDetails.module.css';
// import { ProfileDetailsProps } from '../../services/types/types';
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
                        <li className={styles.cardItem}>
                            Имя сотрудника: <span className={`${styles.textShadows} ${styles.selectedText} text text_type_main-medium mb-8`}>{user.name}</span>
                        </li>
                        <li className={styles.cardItem}>
                            <button
                                className={styles.mr4}
                                onClick={handleCloseSession}
                            >
                                Закончить смену
                            </button>
                        </li>
                    </ul>
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

export default ProfileDetails;