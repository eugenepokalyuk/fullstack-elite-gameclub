import React, { useEffect, useState } from 'react';
// import styles from './App.module.css';
import './App.css';
import AppHeader from '../AppHeader/AppHeader';

import { HomePage } from '../../pages/HomePage/HomePage';
import { StorePage } from '../../pages/StorePage/StorePage';
import { WarehousePage } from '../../pages/WarehousePage/WarehousePage';
import { StatPage } from '../../pages/StatPage/StatPage';
import { SettingsPage } from '../../pages/SettingsPage/SettingsPage';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faWarning } from '@fortawesome/free-solid-svg-icons';

import {
  FETCH_COMPUTERS_FAILURE,
  FETCH_COMPUTERS_REQUEST,
  FETCH_COMPUTERS_SUCCESS
} from '../../services/actions/computers';

import {
  FETCH_STORE_FAILURE,
  FETCH_STORE_REQUEST,
  FETCH_STORE_SUCCESS
} from '../../services/actions/store';

import { useAppDispatch, useAppSelector } from "../../services/hooks/hooks";

import {
  fetchComputersData,
  fetchStoreData,
  fetchUserRefresh,
} from '../../utils/api';

import {
  DEFAULT_PATH,
  SETTINGS_PATH,
  STORE_PATH,
  STAT_PATH,
  WAREHOUSE_PATH,
  ERROR_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  PROFILE_PATH,
  STAT_SESSION_PATH
} from '../../utils/routePath';

import Modal from '../Modal/Modal';
import { ErrorPage } from '../../pages/ErrorPage/ErrorPage';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage/RegisterPage';
import { CHECK_USER_FAILURE, GET_USER_SUCCESS } from '../../services/actions/auth';
import { ProfilePage } from '../../pages/ProfilePage/ProfilePage';
import { StatSessionPage } from '../../pages/StatSessionPage/StatSessionPage';
import { SWITCH_PAYMENT_REQUEST } from '../../services/actions/payment';
import { CARD } from '../../utils/constants';
import { useTheme } from '../../services/hooks/useTheme';
import { TComputer } from '../../services/types/types';

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, isLoading] = useState<boolean>(false);
  const [failed, isFailed] = useState<boolean>(false);
  const background = location.state && location.state.background;


  const { theme, setTheme } = useTheme();

  const closeModal = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload()
  }

  useEffect(() => {
    let userUUID = localStorage.getItem('uuid');
    let sessionUUID = localStorage.getItem('sessionId');

    if (userUUID && sessionUUID) {
      fetchUserRefresh(userUUID, sessionUUID)
        .then(res => {
          dispatch({ type: GET_USER_SUCCESS, payload: { ...res, uuid: userUUID, sessionId: sessionUUID } });
        })
        .catch(error => {
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

      dispatch({ type: SWITCH_PAYMENT_REQUEST, payload: CARD });
    }

  }, [dispatch]);

  // const playground = useAppSelector(store => store.playground.computers);
  // const computer: TComputer = playground?.find((item: TComputer) => item);
  // useEffect(() => {

  //   const endSession = computer?.details?.time.until.timestamp;
  //   const interval = setInterval(() => {
  //     if (endSession) {
  //       const currentTimestamp = Date.now() / 1000; // Текущее время в секундах
  //       const timeLeft = Math.floor((endSession - currentTimestamp) / 60); // Рассчитываем время в минутах
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    // Функция для запроса данных
    const fetchData = () => {
      dispatch({ type: FETCH_STORE_REQUEST });

      fetchComputersData()
        .then(res => {
          dispatch({ type: FETCH_COMPUTERS_SUCCESS, payload: res });
        })
        .catch(error => {
          dispatch({ type: FETCH_COMPUTERS_FAILURE, payload: error });
        });
    };

    // Запуск функции при монтировании компонента
    fetchData();

    // Настройка интервала
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 30 секунд

    // Функция очистки, вызываемая при размонтировании компонента
    return () => clearInterval(interval);

  }, [dispatch]); // Зависимости useEffect

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
            <div>
            </div>
            <div>
              <p className="textOrangeColor">
                Ошибка сессии пользователя
              </p>
              <div>
                <FontAwesomeIcon
                  icon={faWarning}
                  size="5x"
                  className="faSpinner"
                />
              </div>
              <button className="buttonDefault" onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </div>
          </Modal>
          : <Modal onClose={closeModal} header="Загрузка данных">
            <div>
              <p className="textOrangeColor">
                Пожалуйста подождите
              </p>
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
      }
    </>
  );
}

export default App;