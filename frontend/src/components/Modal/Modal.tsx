import React, { FC, useEffect, useCallback } from 'react';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './Modal.module.css';
import ReactDOM from 'react-dom';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import { ModalProps } from '../../services/types/types'

const Modal: FC<ModalProps> = ({ children, header, onClose }) => {
  const onCloseCallback = useCallback(onClose, [onClose]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Escape') {
      onCloseCallback();
    }
  };

  useEffect(() => {
    const handleKeyDown: EventListener = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Escape') {
        onCloseCallback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseCallback]);

  return ReactDOM.createPortal(
    <>
      <div className={styles.modal} data-cy="modalContainer">
        <div className={`${styles.modalContent} pt-10 pr-10 pb-15 pl-10 text-center`} onKeyDown={onKeyDown}>
          <div className={`${header ? styles.modalHeader : `${styles.modalNoHeader} mt-5 mb-5`} d-flex`}>
            {header && <span className='text text_type_main-large'>{header}</span>}
            {onClose && (
              <span className={`${styles.closeIcon} ml-auto`} data-cy="modalCloseIcon">
                <CloseIcon type='primary' onClick={onClose} />
              </span>
            )}
          </div>
          <div className={styles.modalBody}>
            {children}
          </div>
        </div>
      </div>
      <ModalOverlay onClose={onClose} />
    </>,
    document.getElementById('root') as HTMLElement
  );
};

export default Modal;