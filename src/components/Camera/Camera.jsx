import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { setupCamera, capturePhoto, cleanupCamera } from '../../utils/camera';
import styles from './Camera.module.css';

const Camera = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const countdownRef = useRef(null);
    const [photoStage, setPhotoStage] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    useEffect(() => {
        setupCamera(videoRef.current);

        return () => {
            cleanupCamera();
        };
    }, []);

    const handleCaptureClick = async () => {
        if (photoStage > 1 || isCounting) return;

        setIsCounting(true);
        let count = 3;
        countdownRef.current.textContent = count;
        countdownRef.current.style.display = 'flex';

        const countdown = setInterval(() => {
            count--;
            if (count > 0) {
                countdownRef.current.textContent = count;
            } else {
                clearInterval(countdown);
                countdownRef.current.style.display = 'none';
                setIsCounting(false);

                const ctx = canvasRef.current.getContext('2d');
                capturePhoto(videoRef.current, ctx, photoStage, () => {
                    setPhotoStage(prev => prev + 1);

                    if (photoStage === 0) {
                        videoRef.current.style.top = '50%';
                    } else if (photoStage === 1) {
                        const frame = new Image();
                        frame.onload = () => {
                            ctx.drawImage(frame, 0, 0, 1176, 1470);
                            localStorage.setItem('photoStrip', canvasRef.current.toDataURL('image/png'));
                            navigate('/final');
                        };
                        frame.src = '/Assets/fish-photobooth/camerapage/frame.png';
                    }
                });
            }
        }, 1000);
    };

    return (
        <div className={styles.cameraPage}>
            <Logo />

            <div className={styles.photoboothContainer}>
                <div className={styles.bubbleContainer} id="bubbleContainer"></div>

                <div
                    ref={countdownRef}
                    className={styles.countdownTimer}
                >
                    3
                </div>

                <canvas
                    ref={canvasRef}
                    id="finalCanvas"
                    width="1176"
                    height="1470"
                    className={styles.finalCanvas}
                />

                <video
                    ref={videoRef}
                    id="liveVideo"
                    autoPlay
                    playsInline
                    muted
                    className={styles.liveVideo}
                />

                <img
                    className={styles.frameOverlay}
                    src="/Assets/fish-photobooth/camerapage/frame.png"
                    alt="frame overlay"
                />
            </div>

            <div className={styles.controls}>
                <button
                    id="takePhoto"
                    className={styles.captureButton}
                    onClick={handleCaptureClick}
                    disabled={photoStage > 1 || isCounting}
                >
                    Capture
                </button>
            </div>
        </div>
    );
};

export default Camera;