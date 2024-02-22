import { useEffect, useState } from 'react';
// import styles from './App.module.css';
import AppHeader from '../AppHeader/AppHeader';
import './App.css';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage/HomePage';
import { SettingsPage } from '../../pages/SettingsPage/SettingsPage';
import { StatPage } from '../../pages/StatPage/StatPage';
import { StorePage } from '../../pages/StorePage/StorePage';
import { WarehousePage } from '../../pages/WarehousePage/WarehousePage';

import { faSpinner, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

import { useAppDispatch } from "../../services/hooks/hooks";

import {
  fetchComputersData,
  fetchStoreData,
  fetchUserRefresh,
} from '../../utils/api';

import {
  DEFAULT_PATH,
  ERROR_PATH,
  LOGIN_PATH,
  PROFILE_PATH,
  REGISTER_PATH,
  SETTINGS_PATH,
  STAT_PATH,
  STAT_SESSION_PATH,
  STORE_PATH,
  WAREHOUSE_PATH
} from '../../utils/routePath';

import { ErrorPage } from '../../pages/ErrorPage/ErrorPage';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { ProfilePage } from '../../pages/ProfilePage/ProfilePage';
import { RegisterPage } from '../../pages/RegisterPage/RegisterPage';
import { StatSessionPage } from '../../pages/StatSessionPage/StatSessionPage';
import { CHECK_USER_FAILURE, GET_USER_SUCCESS } from '../../services/actions/auth';
import { SWITCH_PAYMENT_REQUEST } from '../../services/actions/payment';
import { useTheme } from '../../services/hooks/useTheme';
import { CARD } from '../../utils/constants';
import Modal from '../Modal/Modal';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

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