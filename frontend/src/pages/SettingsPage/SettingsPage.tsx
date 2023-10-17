import ComputerList from "../../components/ComputerList/ComputerList";
import { PersonalSettings } from "../../components/PersonalSettings/PersonalSettings";
import styles from "./SettingsPage.module.css";
import Image from '../../images/profileBackground.jpeg'

export const SettingsPage = () => (
    <section className={styles.container}>
        <h1>Настройки</h1>

        <div className={styles.imageContainer}>
            <img src={Image} alt="" />
        </div>

        <article>
            <PersonalSettings />
            <ComputerList />
        </article>
    </section>
);