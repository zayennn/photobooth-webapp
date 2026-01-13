import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Logo.module.css';

const Logo = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/');
  };
  
  return (
    <div className={styles.logo} onClick={handleClick}>
      <img 
        src="/Assets/fish-photobooth/logo-new.png" 
        alt="Nashallery's Booth Logo"
      />
    </div>
  );
};

export default Logo;