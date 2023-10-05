import styles from "./StatPage.module.css";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import data from "../../utils/store.json";

export const StatPage = () => {
    return (
        <section className={styles.container}>
            <h1>Статистика</h1>
            {/* графики */}
            <article>
                <p>Какие-то графики</p>
            </article>
        </section>
    )
};