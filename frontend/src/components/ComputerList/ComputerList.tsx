import { FC, useState } from 'react';
import styles from './ComputerList.module.css';
import { TComputer } from '../../services/types/types';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from '../../services/actions/computers';
import { fetchComputersData } from '../../utils/api';
import Modal from '../Modal/Modal';
import ComputerDetails from '../ComputerDetails/ComputerDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { COMPUTER_STATUS_SETTINGS } from '../../utils/constants';


const ComputerList: FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading,] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [statement, setStatement] = useState<string>('');
    const computerList = useAppSelector((store) => store.playground.computers)
    const [computer, setComputer] = useState<TComputer>()

    const handleComputerClick = (computer: TComputer) => {
        setComputer(computer);
        setModalOpen(true);
        setStatement(COMPUTER_STATUS_SETTINGS);
    }

    const closeModal = () => {
        dispatch({ type: FETCH_COMPUTERS_REQUEST });

        fetchComputersData()
            .then(res => {
                dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
            })
            .catch(error => {
                dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
            });
        setModalOpen(false);
    };

    return (
        <>
            <h3 className='mt-1 whiteMessage'>Список ваших устройств:</h3>

            <ul className='flex flexWrap mt-1'>
                {computerList && computerList.map((item: TComputer) => {
                    return (
                        <li key={item.id} className={styles.listItem} onClick={() => handleComputerClick(item)}>{item.name}</li>
                    )
                })}
            </ul>
            {isLoading && (
                <Modal onClose={closeModal}>
                    <div>
                        <p>Пожалуйста подождите</p>
                        <div>
                            <FontAwesomeIcon
                                icon={faSpinner}
                                spin
                                size="5x"
                                className="faSpinner"
                            />
                        </div>
                    </div>
                </Modal>
            )}

            {isModalOpen && computer && (
                <Modal onClose={closeModal} header={computer.name}>
                    {computer ? (
                        <ComputerDetails computer={computer} statement={statement} />
                    ) : (
                        <p className="text text_type_main-medium">Ошибка при создании заказа. Попробуйте еще раз.</p>
                    )}
                </Modal>
            )}
        </>
    );
}

export default ComputerList;