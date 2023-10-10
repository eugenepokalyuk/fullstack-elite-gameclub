import styles from "./StatConstructor.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const StatConstructor = () => {
    const navigate = useNavigate();
    const [loading, isLoading] = useState<boolean>(false);

    const closeModal = () => {
        navigate(-1);
    };

    return (
        <>
            {!loading
                ? <>
                    <article>
                        В ходе разработки
                    </article>
                </>
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
        </>
    )
};