import ProfileDetails from "../../components/ProfileDetails/ProfileDetails";
import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
    return (
        <section className={styles.container}>
            <h1>Профиль</h1>
            <ProfileDetails />
        </section>
    )
};