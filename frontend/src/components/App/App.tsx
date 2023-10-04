import React, { useState } from 'react';
import styles from './App.module.css';
import AppHeader from '../AppHeader/AppHeader';
import Constructor from '../Constructor/Constructor';
import { HomePage } from '../../pages/HomePage/HomePage';
import { SettingsPage } from '../../pages/SettingsPage/SettingsPage';
import { StorePage } from '../../pages/StorePage/StorePage';
import { StatPage } from '../../pages/StatPage/StatPage';

import { DEFAULT_PATH, SETTINGS_PATH, STORE_PATH, STAT_PATH } from '../../utils/routePath';
import { Route, Routes, useLocation, useMatch, useNavigate } from 'react-router-dom';
const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, isLoading] = useState<boolean>(Boolean);
  const background = location.state && location.state.background;

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
        <Route path={DEFAULT_PATH} element={<HomePage />} />
        <Route path={SETTINGS_PATH} element={<SettingsPage />} />
        <Route path={STAT_PATH} element={<StatPage />} />
        <Route path={STORE_PATH} element={<StorePage />} />
      </Routes>
    </>
  );
}

export default App;