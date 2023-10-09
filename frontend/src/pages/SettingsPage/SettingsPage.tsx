import ComputerList from "../../components/ComputerList/ComputerList";
import styles from "./SettingsPage.module.css";

export const SettingsPage = () => (
    <section className={styles.container}>
        <h1>Настройки</h1>

        <article>
            <ComputerList />
        </article>
    </section>
);