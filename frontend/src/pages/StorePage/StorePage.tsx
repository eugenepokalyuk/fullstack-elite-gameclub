import styles from "./StorePage.module.css";
import { Store } from '../../components/Store/Store';

export const StorePage = () => {
    return (
        <main className={styles.container}>
            <h1>Магазин</h1>
            <Store />
        </main >
    );
};