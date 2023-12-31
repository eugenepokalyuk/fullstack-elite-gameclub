import ComputerList from "../../components/ComputerList/ComputerList";
import { PersonalSettings } from "../../components/PersonalSettings/PersonalSettings";
import styles from "./SettingsPage.module.css";
import Image from '../../images/profileBackground.jpeg'

export const SettingsPage = () => (
    <section className={styles.container}>
        <h1>Настройки</h1>

        <article>
            <PersonalSettings />
            <ComputerList />
        </article>
    </section>
);