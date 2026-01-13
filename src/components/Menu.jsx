import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import '../styles/home.css';

const Menu = () => {
    const navigate = useNavigate();

    return (
        <div className="menu-page">
            <Logo />

            <div className="menu-container">
                <div className="menu-header"></div>
                <button
                    id="menu-camera-button"
                    onClick={() => navigate('/camera')}
                >
                    Take photos
                </button>
                <button
                    id="menu-upload-button"
                    onClick={() => navigate('/upload')}
                >
                    Upload photos
                </button>
            </div>
        </div>
    );
};

export default Menu;