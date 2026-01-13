import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Camera.css';

const Upload = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const bubbleContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadBtnRef = useRef(null);
  const readyBtnRef = useRef(null);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    // Load bubbles.js
    const loadBubbles = () => {
      const script = document.createElement('script');
      script.src = 'Javascripts/bubbles.js';
      script.async = true;
      document.body.appendChild(script);
      return script;
    };

    const loadUpload = () => {
      const script = document.createElement('script');
      script.src = 'Javascripts/upload.js';
      script.async = true;
      document.body.appendChild(script);
      return script;
    };

    const bubblesScript = loadBubbles();
    const uploadScript = loadUpload();

    if (uploadBtnRef.current && fileInputRef.current) {
      uploadBtnRef.current.addEventListener('click', () => {
        fileInputRef.current.click();
      });
    }

    return () => {
      if (bubblesScript) document.body.removeChild(bubblesScript);
      if (uploadScript) document.body.removeChild(uploadScript);
    };
  }, []);

  return (
    <>
      <div className="logo" onClick={handleLogoClick}>
        <img src="Assets/fish-photobooth/logo-new.png" alt="Logo" />
      </div>

      <div className="photobooth-container" id="booth">
        <div className="bubble-container" ref={bubbleContainerRef}></div>
        <canvas 
          id="finalCanvas" 
          ref={canvasRef}
          width="1176" 
          height="1470"
        ></canvas>

        {/* hidden file input */}
        <input 
          type="file" 
          id="uploadPhotoInput" 
          ref={fileInputRef}
          accept="image/*" 
          style={{ display: 'none' }}
        />

        <img 
          className="frame-overlay" 
          src="Assets/fish-photobooth/camerapage/frame.png" 
          alt="frame overlay" 
        />
      </div>

      <div className="controls">
        <button id="uploadPhoto" ref={uploadBtnRef} onClick={handleUploadClick}>
          Upload Photo
        </button>
        <button id="readyButton" ref={readyBtnRef} disabled style={{ display: 'none' }}>
          Ready
        </button>
      </div>

    </>
  );
};

export default Upload;