import { StatConstructor } from "../../components/StatConstructor/StatConstructor";
import styles from "./StatPage.module.css";

export const StatPage = () => {
    return (
        <section className={styles.container}>
            <h1>Статистика</h1>
            <StatConstructor />
        </section>
    )
};