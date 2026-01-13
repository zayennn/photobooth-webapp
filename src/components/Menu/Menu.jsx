import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import styles from './Menu.module.css';

const Menu = () => {
    const navigate = useNavigate();

    const handleCameraClick = () => {
        navigate('/camera');
    };

    const handleUploadClick = () => {
        navigate('/upload');
    };

    return (
        <div className={styles.menuContainer}>
            <Logo />

            <div className={styles.menuHeader} />

            <button
                id="menu-camera-button"
                className={styles.menuButton}
                onClick={handleCameraClick}
            >
                Take photos
            </button>

            <button
                id="menu-upload-button"
                className={styles.menuButton}
                onClick={handleUploadClick}
            >
                Upload photos
            </button>
        </div>
    );
};

export default Menu;