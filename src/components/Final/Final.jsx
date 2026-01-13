import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Final.css';

const Final = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const addFishRef = useRef(null);
    const addOctopusRef = useRef(null);
    const addSeaweedRef = useRef(null);
    const addAxRef = useRef(null);
    const addBubbleRef = useRef(null);
    const resetRef = useRef(null);
    const downloadBtnRef = useRef(null);
    const homeBtnRef = useRef(null);

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleDownload = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = 'fish-photobooth.png';
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    useEffect(() => {
        const loadFinal = async () => {
            try {
                const module = await import('../utils/final.js');
                if (module.init) {
                    module.init({
                        canvas: canvasRef.current,
                        addFishBtn: addFishRef.current,
                        addOctopusBtn: addOctopusRef.current,
                        addSeaweedBtn: addSeaweedRef.current,
                        addAxBtn: addAxRef.current,
                        addBubbleBtn: addBubbleRef.current,
                        resetBtn: resetRef.current,
                        downloadBtn: downloadBtnRef.current,
                        homeBtn: homeBtnRef.current
                    });
                }
            } catch (error) {
                console.error('Error loading final.js:', error);
            }
        };

        loadFinal();

        if (homeBtnRef.current) {
            homeBtnRef.current.addEventListener('click', handleHome);
        }

        if (downloadBtnRef.current) {
            downloadBtnRef.current.addEventListener('click', handleDownload);
        }

        return () => {
            if (homeBtnRef.current) {
                homeBtnRef.current.removeEventListener('click', handleHome);
            }
            if (downloadBtnRef.current) {
                downloadBtnRef.current.removeEventListener('click', handleDownload);
            }
        };
    }, []);

    return (
        <>
            <div className="logo" onClick={handleLogoClick}>
                <img src="Assets/fish-photobooth/logo-new.png" alt="Logo" />
            </div>

            <div className="heading-content">
                <div className="menu-header" style={{ display: 'none' }}></div>
                <div className="sticker-container">
                    <h1>Add Stickers!</h1>
                    <p>(drag to reposition)</p>
                    <div className="sticker-btns">
                        <button id="addFish" ref={addFishRef} className="sticker-btn fish-btn">Add Fish</button>
                        <button id="addOctopus" ref={addOctopusRef} className="sticker-btn octopus-btn">Add Octopus</button>
                        <button id="addSeaweed" ref={addSeaweedRef} className="sticker-btn seaweed-btn">Add Seaweed</button>
                        <button id="addAx" ref={addAxRef} className="sticker-btn axolotl-btn">Add Axolotl</button>
                        <button id="addBubble" ref={addBubbleRef} className="sticker-btn bubble-btn">Add Bubble</button>
                        <button id="reset" ref={resetRef} className="sticker-btn reset-btn">Reset</button>
                    </div>
                </div>
            </div>

            <div id="canvasContainer">
                <canvas
                    id="finalCanvas"
                    ref={canvasRef}
                    width="1176"
                    height="1470"
                ></canvas>
            </div>

            <div className="button-container">
                <button id="downloadBtn" ref={downloadBtnRef} onClick={handleDownload}>Download</button>
                <button id="homeBtn" ref={homeBtnRef} onClick={handleHome}>Home</button>
            </div>
        </>
    );
};

export default Final;