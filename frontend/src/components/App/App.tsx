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
import { useAppDispatch, useAppSelector } from "../../services/hooks/hooks";
import { fetchComputersData, fetchStoreData, fetchUserRefresh } from '../../utils/api';
import { DEFAULT_PATH, SETTINGS_PATH, STORE_PATH, STAT_PATH, WAREHOUSE_PATH, ERROR_PATH, LOGIN_PATH, REGISTER_PATH, PROFILE_PATH, STAT_SESSION_PATH } from '../../utils/routePath';
import Modal from '../Modal/Modal';
import { ErrorPage } from '../../pages/ErrorPage/ErrorPage';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage/RegisterPage';
import { CHECK_USER_FAILURE, GET_USER_SUCCESS } from '../../services/actions/auth';
import { ProfilePage } from '../../pages/ProfilePage/ProfilePage';
import { StatSessionPage } from '../../pages/StatSessionPage/StatSessionPage';

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
    let userUUID = sessionStorage.getItem('uuid');
    let sessionUUID = sessionStorage.getItem('sessionId');

    if (userUUID && sessionUUID) {
      fetchUserRefresh(userUUID)
        .then(res => {
          dispatch({ type: GET_USER_SUCCESS, payload: { ...res, uuid: userUUID, sessionId: sessionUUID } });
        })
        .catch(error => {
          // sessionStorage.clear();
          dispatch({ type: CHECK_USER_FAILURE, payload: error });
        });

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
    }

  }, [dispatch]);

  return (
    <>
      <AppHeader />
      {!loading
        ? <>
          <Routes location={background || location}>
            <Route path={LOGIN_PATH} element={<ProtectedRoute auth={false} children={<LoginPage />} />} />
            <Route path={REGISTER_PATH} element={<ProtectedRoute auth={false} children={<RegisterPage />} />} />

            <Route path={DEFAULT_PATH} element={<ProtectedRoute auth={true} children={<HomePage />} />} />
            <Route path={SETTINGS_PATH} element={<ProtectedRoute auth={true} children={<SettingsPage />} />} />
            <Route path={STAT_SESSION_PATH} element={<ProtectedRoute auth={true} children={<StatSessionPage />} />} />
            <Route path={STAT_PATH} element={<ProtectedRoute auth={true} children={<StatPage />} />} />
            <Route path={STORE_PATH} element={<ProtectedRoute auth={true} children={<StorePage />} />} />
            <Route path={WAREHOUSE_PATH} element={<ProtectedRoute auth={true} children={<WarehousePage />} />} />
            <Route path={ERROR_PATH} element={<ProtectedRoute auth={true} children={<ErrorPage />} />} />
            <Route path={PROFILE_PATH} element={<ProtectedRoute auth={true} children={<ProfilePage />} />} />
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