import { useEffect } from "react";
import styles from "./StatPage.module.css";
import { fetchStatPC, fetchStatStore } from "../../utils/api";

export const StatPage = () => {
    const from = "2019-08-24T14:15:22Z";
    const until = "2024-08-24T14:15:22Z";

    const getStatPC = () => {
        fetchStatPC(from, until)
            .then(res => {
                console.log({ res });
            })
            .catch(error => {
                console.log({ error });
            });
    }
    const getStatStore = () => {
        fetchStatStore(from, until)
            .then(res => {
                console.log({ res });
            })
            .catch(error => {
                console.log({ error });
            });
    }

    return (
        <section className={styles.container}>
            <h1>Статистика</h1>

            <article>
                <button onClick={getStatPC}>
                    getStatPC
                </button>

                <button onClick={getStatStore}>
                    getStatStore
                </button>
            </article>
        </section>
    )
};