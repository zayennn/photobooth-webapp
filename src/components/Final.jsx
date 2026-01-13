import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Final = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const WIDTH = 1176;
    const HEIGHT = 1470;

    const [stickers, setStickers] = useState([]);
    const [activeStickerId, setActiveStickerId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [baseImage, setBaseImage] = useState(null);

    const seaweedImages = [
        '/Assets/fish-photobooth/camerapage/stickers/seaweed1.png',
        '/Assets/fish-photobooth/camerapage/stickers/seaweed2.png'
    ];

    const bubbleImages = [
        '/Assets/fish-photobooth/camerapage/stickers/bubble1.png',
        '/Assets/fish-photobooth/camerapage/stickers/bubble2.png'
    ];

    const [seaweedIndex, setSeaweedIndex] = useState(0);
    const [bubbleIndex, setBubbleIndex] = useState(0);

    /* ================= LOAD BASE IMAGE ================= */
    useEffect(() => {
        const dataURL = localStorage.getItem('photoStrip');
        if (!dataURL) {
            alert('No photo found');
            navigate('/camera');
            return;
        }

        const img = new Image();
        img.onload = () => {
            setBaseImage(img);
            draw(img, []);
        };
        img.src = dataURL;
    }, [navigate]);

    /* ================= DRAW FUNCTION ================= */
    const draw = (base, stickersToDraw) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.drawImage(base, 0, 0, WIDTH, HEIGHT);

        stickersToDraw.forEach(s => {
            ctx.drawImage(s.img, s.x, s.y, s.width, s.height);
        });
    };

    useEffect(() => {
        if (baseImage) draw(baseImage, stickers);
    }, [stickers, baseImage]);

    /* ================= ADD STICKER ================= */
    const addSticker = (src) => {
        const img = new Image();
        img.onload = () => {
            setStickers(prev => [
                ...prev,
                {
                    id: Date.now(),
                    img,
                    x: WIDTH / 2 - 100,
                    y: HEIGHT / 2 - 100,
                    width: img.width / 3,
                    height: img.height / 3
                }
            ]);
        };
        img.src = src;
    };

    /* ================= POINTER UTILS ================= */
    const getPointerPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = WIDTH / rect.width;
        const scaleY = HEIGHT / rect.height;

        const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
        const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;

        return { x: x * scaleX, y: y * scaleY };
    };

    /* ================= DRAG LOGIC ================= */
    const handlePointerDown = (e) => {
        const { x, y } = getPointerPos(e);

        for (let i = stickers.length - 1; i >= 0; i--) {
            const s = stickers[i];
            if (
                x >= s.x &&
                x <= s.x + s.width &&
                y >= s.y &&
                y <= s.y + s.height
            ) {
                setActiveStickerId(s.id);
                setDragOffset({ x: x - s.x, y: y - s.y });

                // bring to front
                setStickers(prev => {
                    const copy = [...prev];
                    const found = copy.splice(i, 1)[0];
                    copy.push(found);
                    return copy;
                });
                break;
            }
        }
    };

    const handlePointerMove = (e) => {
        if (!activeStickerId) return;
        const { x, y } = getPointerPos(e);

        setStickers(prev =>
            prev.map(s =>
                s.id === activeStickerId
                    ? { ...s, x: x - dragOffset.x, y: y - dragOffset.y }
                    : s
            )
        );
    };

    const handlePointerUp = () => {
        setActiveStickerId(null);
    };

    /* ================= DOWNLOAD ================= */
    const handleDownload = () => {
        canvasRef.current.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fish-photobooth.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    /* ================= RESET ================= */
    const handleReset = () => {
        setStickers([]);
        if (baseImage) draw(baseImage, []);
    };

    return (
        <div className="final-page">
            <Logo />

            <div className="sticker-container">
                <h1>Add Stickers!</h1>
                <p>(drag to reposition)</p>

                <div className="sticker-btns">
                    <button
                        id="addFish"
                        className="sticker-btn fish-btn"
                        onClick={() => addSticker('/Assets/fish-photobooth/camerapage/stickers/fish.png')}
                    >
                        Add Fish
                    </button>
                    <button
                        id="addOctopus"
                        className="sticker-btn octopus-btn"
                        onClick={() => addSticker('/Assets/fish-photobooth/camerapage/stickers/octopus.png')}
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
                        onClick={() => addSticker('/Assets/fish-photobooth/camerapage/stickers/axolotl.png')}
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

            <div id="canvasContainer">
                <canvas
                    ref={canvasRef}
                    width={WIDTH}
                    height={HEIGHT}
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                    style={{ width: '100%', touchAction: 'none', cursor: 'grab' }}
                />
            </div>

            <div className="button-container">
                <button onClick={handleDownload}>Download</button>
                <button onClick={() => navigate('/')}>Home</button>
            </div>
        </div>
    );
};

export default Final;