import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import AppHeader from '../AppHeader/AppHeader';

import { HomePage } from '../../pages/HomePage/HomePage';
import { StorePage } from '../../pages/StorePage/StorePage';
import { WarehousePage } from '../../pages/WarehousePage/WarehousePage';
import { StatPage } from '../../pages/StatPage/StatPage';
import { SettingsPage } from '../../pages/SettingsPage/SettingsPage';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faWarning } from '@fortawesome/free-solid-svg-icons';

import { FETCH_COMPUTERS_FAILURE, FETCH_COMPUTERS_REQUEST, FETCH_COMPUTERS_SUCCESS } from '../../services/actions/computers';
import { FETCH_STORE_FAILURE, FETCH_STORE_REQUEST, FETCH_STORE_SUCCESS } from '../../services/actions/store';
import { useAppDispatch } from "../../services/hooks/hooks";
import { fetchComputersData, fetchStoreData } from '../../utils/api';
import { DEFAULT_PATH, SETTINGS_PATH, STORE_PATH, STAT_PATH, WAREHOUSE_PATH } from '../../utils/routePath';
import Modal from '../Modal/Modal';

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, isLoading] = useState<boolean>(false);
  const [failed, isFailed] = useState<boolean>(false);
  const background = location.state && location.state.background;

  const closeModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch({ type: FETCH_COMPUTERS_REQUEST });
    isLoading(true);

    fetchComputersData()
      .then(res => {
        isLoading(false);
        dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
      })
      .catch(error => {
        isFailed(true)
        dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: FETCH_STORE_REQUEST });
    isLoading(true);

    fetchStoreData()
      .then(res => {
        isLoading(false);
        dispatch({ type: FETCH_STORE_SUCCESS, payload: res });
      })
      .catch(error => {
        dispatch({ type: FETCH_STORE_FAILURE, payload: error });
      });
  }, [dispatch]);

  return (
    <>
      <AppHeader />
      {!loading
        ? <>
          <Routes location={background || location}>
            <Route path={DEFAULT_PATH} element={<HomePage />} />
            <Route path={SETTINGS_PATH} element={<SettingsPage />} />
            <Route path={STAT_PATH} element={<StatPage />} />
            <Route path={STORE_PATH} element={<StorePage />} />
            <Route path={WAREHOUSE_PATH} element={<WarehousePage />} />
          </Routes>
        </>
        : failed
          ? <Modal onClose={closeModal} header="Ошибка!">
            <div className="mb-4 mt-4">
            </div>
            <div>
              <p className={`${styles.textOrangeColor} text text_type_main-medium mb-8`}>
                Проверьте интернет соединение
              </p>
              <div className={`${styles.flex} text_color_inactive`}>
                <FontAwesomeIcon
                  icon={faWarning}
                  size="5x"
                  className={`${styles.faSpinner}`}
                />
              </div>
            </div>
          </Modal>
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
          </Modal>
      }
    </>
  );
}

export default App;