import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import BubbleAnimation from './BubbleAnimation';

const Upload = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const [photoStage, setPhotoStage] = useState(0); // 0=top, 1=bottom, 2=done
    const [isReady, setIsReady] = useState(false);

    const WIDTH = 1176;
    const HEIGHT = 1470;
    const HALF = HEIGHT / 2;

    useEffect(() => {
        localStorage.removeItem('photoStrip');
    }, []);

    const drawPhoto = (img) => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const yOffset = photoStage === 0 ? 0 : HALF;
        const imgAspect = img.width / img.height;
        const targetAspect = WIDTH / HALF;
        let sx, sy, sw, sh;

        if (imgAspect > targetAspect) {
            sh = img.height;
            sw = img.height * targetAspect;
            sx = (img.width - sw) / 2;
            sy = 0;
        } else {
            sw = img.width;
            sh = img.width / targetAspect;
            sx = 0;
            sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);

        if (photoStage === 0) {
            setPhotoStage(1);
        } else if (photoStage === 1) {
            setPhotoStage(2);
            finalizePhotoStrip();
        }
    };

    const finalizePhotoStrip = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const frame = new Image();

        frame.onload = () => {
            ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
            setIsReady(true);
        };
        frame.src = 'Assets/fish-photobooth/camerapage/frame.png';
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => drawPhoto(img);
        img.src = URL.createObjectURL(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleReady = () => {
        if (!canvasRef.current) return;

        localStorage.setItem('photoStrip', canvasRef.current.toDataURL('image/png'));
        navigate('/final');
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;

        canvasRef.current.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'photo-strip.png';
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    return (
        <div className="upload-page">
            <Logo />

            <div className="photobooth-container" id="booth">
                <BubbleAnimation />

                <canvas
                    id="finalCanvas"
                    ref={canvasRef}
                    width="1176"
                    height="1470"
                />

                <input
                    type="file"
                    id="uploadPhotoInput"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />

                <img
                    className="frame-overlay"
                    src="Assets/fish-photobooth/camerapage/frame.png"
                    alt="frame overlay"
                />
            </div>

            <div className="controls">
                <button
                    id="uploadPhoto"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Upload Photo
                </button>

                {isReady && (
                    <>
                        <button
                            id="readyButton"
                            onClick={handleReady}
                        >
                            Ready
                        </button>
                        <button
                            id="downloadBtn"
                            onClick={handleDownload}
                        >
                            Download
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Upload;