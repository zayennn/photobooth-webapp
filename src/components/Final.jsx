import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import '../styles/final.css';

const Final = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [stickers, setStickers] = useState([]);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [seaweedIndex, setSeaweedIndex] = useState(0);
    const [bubbleIndex, setBubbleIndex] = useState(0);

    const WIDTH = 1176;
    const HEIGHT = 1470;

    const seaweedImages = [
        'Assets/fish-photobooth/camerapage/stickers/seaweed1.png',
        'Assets/fish-photobooth/camerapage/stickers/seaweed2.png'
    ];

    const bubbleImages = [
        'Assets/fish-photobooth/camerapage/stickers/bubble1.png',
        'Assets/fish-photobooth/camerapage/stickers/bubble2.png'
    ];

    useEffect(() => {
        const dataURL = localStorage.getItem('photoStrip');
        if (!dataURL) {
            alert("No photo found!");
            navigate('/');
            return;
        }

        const finalImage = new Image();
        finalImage.onload = drawCanvas;
        finalImage.src = dataURL;

        // Clean up
        return () => {
            localStorage.removeItem('photoStrip');
        };
    }, []);

    const drawCanvas = () => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const finalImage = new Image();
        finalImage.onload = () => {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.drawImage(finalImage, 0, 0, WIDTH, HEIGHT);

            stickers.forEach(sticker => {
                ctx.drawImage(sticker.img, sticker.x, sticker.y, sticker.width, sticker.height);
            });
        };
        finalImage.src = localStorage.getItem('photoStrip');
    };

    const addSticker = (src) => {
        const img = new Image();
        img.onload = () => {
            const newSticker = {
                img,
                x: WIDTH / 2 - img.width / 6,
                y: HEIGHT / 2 - img.height / 6,
                width: img.width / 2.5,
                height: img.height / 2.5,
                dragging: false
            };

            setStickers(prev => [...prev, newSticker]);
        };
        img.src = src;
    };

    const getPointerPos = (e) => {
        if (!canvasRef.current) return { x: 0, y: 0 };

        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const clientX = e.touches?.[0]?.clientX ?? e.clientX;
        const clientY = e.touches?.[0]?.clientY ?? e.clientY;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const handlePointerDown = (e) => {
        const { x: mouseX, y: mouseY } = getPointerPos(e);

        for (let i = stickers.length - 1; i >= 0; i--) {
            const sticker = stickers[i];

            if (mouseX >= sticker.x &&
                mouseX <= sticker.x + sticker.width &&
                mouseY >= sticker.y &&
                mouseY <= sticker.y + sticker.height) {

                setSelectedSticker(sticker);
                setDragOffset({
                    x: mouseX - sticker.x,
                    y: mouseY - sticker.y
                });

                // Move sticker to top of array
                const updatedStickers = [...stickers];
                updatedStickers.splice(i, 1);
                updatedStickers.push({ ...sticker, dragging: true });
                setStickers(updatedStickers);

                e.preventDefault();
                break;
            }
        }
    };

    const handlePointerMove = (e) => {
        if (!selectedSticker) return;

        const { x: mouseX, y: mouseY } = getPointerPos(e);

        const updatedStickers = stickers.map(sticker => {
            if (sticker === selectedSticker) {
                return {
                    ...sticker,
                    x: mouseX - dragOffset.x,
                    y: mouseY - dragOffset.y
                };
            }
            return sticker;
        });

        setStickers(updatedStickers);
        e.preventDefault();
    };

    const handlePointerUp = () => {
        if (selectedSticker) {
            const updatedStickers = stickers.map(sticker => {
                if (sticker === selectedSticker) {
                    return { ...sticker, dragging: false };
                }
                return sticker;
            });

            setStickers(updatedStickers);
            setSelectedSticker(null);
        }
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;

        canvasRef.current.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fish-photobooth.png';
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    const handleReset = () => {
        setStickers([]);
        setSeaweedIndex(0);
        setBubbleIndex(0);
    };

    useEffect(() => {
        drawCanvas();
    }, [stickers]);

    return (
        <div className="final-page">
            <Logo />

            <div className="heading-content">
                <div className="menu-header" style={{ display: 'none' }}></div>
                <div className="sticker-container">
                    <h1>Add Stickers!</h1>
                    <p>(drag to reposition)</p>
                    <div className="sticker-btns">
                        <button
                            id="addFish"
                            className="sticker-btn fish-btn"
                            onClick={() => addSticker('Assets/fish-photobooth/camerapage/stickers/fish.png')}
                        >
                            Add Fish
                        </button>
                        <button
                            id="addOctopus"
                            className="sticker-btn octopus-btn"
                            onClick={() => addSticker('Assets/fish-photobooth/camerapage/stickers/octopus.png')}
                        >
                            Add Octopus
                        </button>
                        <button
                            id="addSeaweed"
                            className="sticker-btn seaweed-btn"
                            onClick={() => {
                                addSticker(seaweedImages[seaweedIndex]);
                                setSeaweedIndex((seaweedIndex + 1) % seaweedImages.length);
                            }}
                        >
                            Add Seaweed
                        </button>
                        <button
                            id="addAx"
                            className="sticker-btn axolotl-btn"
                            onClick={() => addSticker('Assets/fish-photobooth/camerapage/stickers/axolotl.png')}
                        >
                            Add Axolotl
                        </button>
                        <button
                            id="addBubble"
                            className="sticker-btn bubble-btn"
                            onClick={() => {
                                addSticker(bubbleImages[bubbleIndex]);
                                setBubbleIndex((bubbleIndex + 1) % bubbleImages.length);
                            }}
                        >
                            Add Bubble
                        </button>
                        <button
                            id="reset"
                            className="sticker-btn reset-btn"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div id="canvasContainer">
                <canvas
                    id="finalCanvas"
                    ref={canvasRef}
                    width="1176"
                    height="1470"
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                    style={{ cursor: selectedSticker ? 'grabbing' : 'grab' }}
                />
            </div>

            <div className="button-container">
                <button id="downloadBtn" onClick={handleDownload}>
                    Download
                </button>
                <button id="homeBtn" onClick={() => navigate('/')}>
                    Home
                </button>
            </div>
        </div>
    );
};

export default Final;