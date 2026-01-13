import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate('/menu');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <div className="logo" onClick={handleLogoClick}>
        <img src="Assets/fish-photobooth/logo-new.png" alt="Logo" />
      </div>

      <div className="home-container">
        <div className="photobooth-container">
          <div className="photobooth-mock"></div>
          <div className="photostrip-mock"></div>
          <div className="bubbles-mock"></div>
          <div className="fish-mock-1"></div>
          <div className="fish-mock-2"></div>
          <div className="fish-mock-3"></div>
        </div>

        <div className="button-container">
          <button id="select-button" onClick={handleSelect}>Select</button>
        </div>
      </div>

      <script src="Javascripts/home.js" async></script>
    </>
  );
};

export default Home;