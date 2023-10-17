import React, { FC, useEffect, useState } from 'react';
import styles from "./InfoBadge.module.css"
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
const InfoBadge: FC = () => {
    const [modal, setModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const closeModal = () => {
        navigate(-1);
    };

    const handleClickButton = () => {
        setModal(true);
    }
    return (
        <>
            {!modal
                ? <>
                    <div className={styles.container}>
                        <button className='smallIncrementButton flex flexCenter' onClick={handleClickButton}>i</button>
                    </div>
                </>
                : <Modal onClose={closeModal} header="Информация">
                    <ul className='flex flexColumn whiteMessage'> Статус устройства
                        <li className='flex flexAlignCenter flexBetween mt-1'>Онлайн <div className='square' style={{
                            background: "var(--backgorund-device-online)"
                        }}></div></li>

                        <li className='flex flexAlignCenter flexBetween mt-1'>Выключен <div className='square' style={{
                            background: "var(--backgorund-device-offline)"
                        }}></div></li>

                        <li className='flex flexAlignCenter flexBetween mt-1'>Занят пользователем <div className='square' style={{
                            background: "var(--backgorund-device-play)"
                        }}></div></li>

                        <li className='flex flexAlignCenter flexBetween mt-1'>Заканчивается время пользователя <div className='square warningArticle'></div></li>

                        <li className='flex flexAlignCenter flexBetween mt-1'>Техническая проблема <div className='square' style={{
                            background: "var(--backgorund-device-problems)"
                        }}></div></li>

                        <li className='flex flexAlignCenter flexBetween mt-1'>Свободен для перемещения <div className='square' style={{
                            background: "var(--backgorund-device-free)",
                            border: "0.3vh solid var(--backgorund-device-online)"
                        }}></div></li>
                    </ul>
                </Modal>
            }
        </>
    )
};

export default InfoBadge;