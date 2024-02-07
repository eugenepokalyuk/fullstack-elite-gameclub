import { StatSessionConstructor } from "../../components/StatSessionConstructor/StatSessionConstructor";
import styles from "./StatSessionPage.module.css";

export const StatSessionPage = () => {
    return (
        <section className={styles.container}>
            <h1>Смена</h1>
            <StatSessionConstructor />
        </section>
    )
};