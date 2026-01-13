import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Camera.css';

const Camera = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const countdownRef = useRef(null);
    const bubbleContainerRef = useRef(null);

    const handleLogoClick = () => {
        navigate('/');
    };

    useEffect(() => {
        const loadBubbles = () => {
            const script = document.createElement('script');
            script.src = 'Javascripts/bubbles.js';
            script.async = true;
            document.body.appendChild(script);
            return script;
        };

        const loadCamera = () => {
            const script = document.createElement('script');
            script.src = 'Javascripts/camera.js';
            script.async = true;
            document.body.appendChild(script);
            return script;
        };

        const bubblesScript = loadBubbles();
        const cameraScript = loadCamera();

        return () => {
            if (bubblesScript) document.body.removeChild(bubblesScript);
            if (cameraScript) document.body.removeChild(cameraScript);
        };
    }, []);

    return (
        <>
            <div className="logo" onClick={handleLogoClick}>
                <img src="Assets/fish-photobooth/logo-new.png" alt="Logo" />
            </div>

            <div className="photobooth-container" id="booth">
                <div className="bubble-container" ref={bubbleContainerRef}></div>
                <div className="countdown-timer" ref={countdownRef}>3</div>
                <canvas
                    id="finalCanvas"
                    ref={canvasRef}
                    width="1176"
                    height="1470"
                ></canvas>
                <video
                    id="liveVideo"
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                ></video>
                <img
                    className="frame-overlay"
                    src="Assets/fish-photobooth/camerapage/frame.png"
                    alt="frame overlay"
                />
            </div>

            <div className="controls">
                <button id="takePhoto">Capture</button>
                <button id="readyButton" disabled style={{ display: 'none' }}>Ready</button>
            </div>

        </>
    );
};

export default Camera;