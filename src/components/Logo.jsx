import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
    const navigate = useNavigate();

    return (
        <div
            className="logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', display: 'block', margin: "0 auto" }}
        >
            <img
                src="Assets/fish-photobooth/logo-new.png"
                alt="Logo"
            />
        </div>
    );
};

export default Logo;