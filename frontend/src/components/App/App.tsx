import React from 'react';
import styles from './App.module.css';
import Header from '../AppHeader/AppHeader';
import Constructor from '../Constructor/Constructor';
const App = () => {
  return (
    <main className={styles.main}>
      <Header />
      <Constructor />
    </main>
  );
}

export default App;