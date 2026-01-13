import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import BubbleAnimation from './BubbleAnimation';

const Camera = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const countdownRef = useRef(null);
    const [photoStage, setPhotoStage] = useState(0); // 0=top, 1=bottom, 2=done
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [stream, setStream] = useState(null);

    const WIDTH = 1176;
    const HEIGHT = 1470;
    const HALF = HEIGHT / 2;

    useEffect(() => {
        setupCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const setupCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 2560 },
                    height: { ideal: 1440 },
                    facingMode: 'user'
                },
                audio: false
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                moveVideoToHalf(0);
            }
        } catch (err) {
            alert('Camera access failed: ' + err);
        }
    };

    const moveVideoToHalf = (index) => {
        if (videoRef.current) {
            videoRef.current.style.display = 'block';
            videoRef.current.style.top = index === 0 ? '0' : '50%';
            videoRef.current.style.left = '0';
            videoRef.current.style.width = '100%';
            videoRef.current.style.height = '50%';
        }
    };

    const startCountdown = () => {
        setIsCountingDown(true);
        setCountdown(3);

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsCountingDown(false);
                    capturePhoto();
                    return 3;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const ctx = canvasRef.current.getContext('2d');
        const yOffset = photoStage === 0 ? 0 : HALF;
        const vW = video.videoWidth;
        const vH = video.videoHeight;
        const targetAspect = WIDTH / HALF;
        const vAspect = vW / vH;
        let sx, sy, sw, sh;

        if (vAspect > targetAspect) {
            sh = vH;
            sw = vH * targetAspect;
            sx = (vW - sw) / 2;
            sy = 0;
        } else {
            sw = vW;
            sh = vW / targetAspect;
            sx = 0;
            sy = (vH - sh) / 2;
        }

        ctx.save();
        ctx.translate(WIDTH, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
        ctx.restore();

        if (photoStage === 0) {
            setPhotoStage(1);
            moveVideoToHalf(1);
        } else if (photoStage === 1) {
            setPhotoStage(2);
            finalizePhotoStrip();
        }
    };

    const finalizePhotoStrip = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        video.style.display = 'none';

        const frame = new Image();
        frame.src = 'Assets/fish-photobooth/camerapage/frame.png';
        frame.onload = () => {
            ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
            localStorage.setItem('photoStrip', canvas.toDataURL('image/png'));
            navigate('/final');
        };

        if (frame.complete) {
            frame.onload();
        }
    };

    const handleTakePhoto = () => {
        if (photoStage > 1) return;
        startCountdown();
    };

    return (
        <div className="camera-page">
            <Logo />

            <div className="photobooth-container" id="booth">
                <BubbleAnimation />

                {isCountingDown && (
                    <div className="countdown-timer" ref={countdownRef}>
                        {countdown}
                    </div>
                )}

                <canvas
                    id="finalCanvas"
                    ref={canvasRef}
                    width="1176"
                    height="1470"
                />

                <video
                    id="liveVideo"
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '50%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)',
                        zIndex: 1,
                        display: 'none'
                    }}
                />

                <img
                    className="frame-overlay"
                    src="Assets/fish-photobooth/camerapage/frame.png"
                    alt="frame overlay"
                />
            </div>

            <div className="controls">
                <button
                    id="takePhoto"
                    onClick={handleTakePhoto}
                    disabled={photoStage > 1}
                >
                    Capture
                </button>
                <button
                    id="readyButton"
                    disabled
                    style={{ display: 'none' }}
                >
                    Ready
                </button>
            </div>
        </div>
    );
};

export default Camera;