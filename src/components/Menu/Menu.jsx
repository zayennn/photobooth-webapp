import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Menu = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleCamera = () => {
        navigate('/camera');
    };

    const handleUpload = () => {
        navigate('/upload');
    };

    return (
        <>
            <div className="logo" onClick={handleLogoClick}>
                <img src="Assets/fish-photobooth/logo-new.png" alt="Logo" />
            </div>

            <div className="menu-container">
                <div className="menu-header"></div>
                <button id="menu-camera-button" onClick={handleCamera}>Take photos</button>
                <button id="menu-upload-button" onClick={handleUpload}>Upload photos</button>
            </div>

            <script src="Javascripts/home.js" async></script>
        </>
    );
};

export default Menu;