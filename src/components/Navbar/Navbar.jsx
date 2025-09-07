import styles from './Navbar.module.css'
import logo from '../../../public/logo.png'
import { useState } from 'react'

const Navbar = ({ toggleBlur, clearData, toggleTheme }) => {
    const [modal, setModal] = useState(false);

    const handleStorage = () => {
        clearData();
        setModal(false);
    }

    const handleBlur = () => {
        toggleBlur();
        setModal(false);
    }

    return (
        <div className={styles.main}>
            <div className={`${styles.modal} ${modal ? styles.modal_visible : ''}`}>
                <button className={styles.modal_button} onClick={handleBlur}>
                    Toggle Blur
                    <div className={styles.key_indicator}>
                        <kbd>B</kbd>
                    </div>
                </button>
                <button className={styles.modal_button} onClick={toggleTheme}>
                    Toggle Theme
                    <div className={styles.key_indicator}>
                        <kbd>T</kbd>
                    </div>
                </button>
                <button className={styles.modal_button} onClick={handleStorage}>Clear Toughts</button>
            </div>

            <img src={logo} className={styles.logo} alt="" />

            <div className={styles.menu_content}>
                <button className={`${styles.menu_button} ${modal ? styles.menu_button_selected : ''}`} onClick={() => setModal(!modal)} >
                    <svg className={styles.menu_svg} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default Navbar;