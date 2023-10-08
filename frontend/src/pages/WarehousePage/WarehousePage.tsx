import styles from "./WarehousePage.module.css";
import { Warehouse } from "../../components/Warehouse/Warehouse";

export const WarehousePage = () => {
    return (
        <section className={styles.container}>
            <h1>Склад</h1>
            <Warehouse />
        </section >
    );
};