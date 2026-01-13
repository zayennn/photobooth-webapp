import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Final = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [stickers, setStickers] = useState([]);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [seaweedIndex, setSeaweedIndex] = useState(0);
    const [bubbleIndex, setBubbleIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const WIDTH = 1176;
    const HEIGHT = 1470;

    const seaweedImages = [
        '/Assets/fish-photobooth/camerapage/stickers/seaweed1.png',
        '/Assets/fish-photobooth/camerapage/stickers/seaweed2.png'
    ];
    
    const bubbleImages = [
        '/Assets/fish-photobooth/camerapage/stickers/bubble1.png',
        '/Assets/fish-photobooth/camerapage/stickers/bubble2.png'
    ];

    useEffect(() => {
        const dataURL = localStorage.getItem('photoStrip');
        console.log('Loading photo from localStorage:', dataURL ? 'Found' : 'Not found');
        
        if (!dataURL) {
            alert("No photo found! Please take a photo first.");
            navigate('/camera');
            return;
        }

        const finalImage = new Image();
        finalImage.crossOrigin = 'anonymous';
        finalImage.onload = () => {
            console.log('Image loaded successfully');
            drawCanvas(finalImage);
            setIsLoaded(true);
        };
        finalImage.onerror = () => {
            console.error('Failed to load image');
            alert("Failed to load photo. Please try again.");
            navigate('/camera');
        };
        finalImage.src = dataURL;
        
        return () => {
            // Optional: Clear localStorage if needed
            // localStorage.removeItem('photoStrip');
        };
    }, [navigate]);

    const drawCanvas = (baseImage) => {
        if (!canvasRef.current || !baseImage) return;
        
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        
        // Gambar foto dasar
        ctx.drawImage(baseImage, 0, 0, WIDTH, HEIGHT);
        
        // Gambar semua sticker
        stickers.forEach(sticker => {
            if (sticker.img && sticker.img.complete) {
                ctx.drawImage(sticker.img, sticker.x, sticker.y, sticker.width, sticker.height);
            }
        });
    };

    const addSticker = (src) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const newSticker = {
                img,
                x: Math.random() * (WIDTH - 100),
                y: Math.random() * (HEIGHT - 100),
                width: img.width / 3,
                height: img.height / 3,
                dragging: false
            };
            
            setStickers(prev => [...prev, newSticker]);
            
            // Redraw canvas dengan sticker baru
            const dataURL = localStorage.getItem('photoStrip');
            if (dataURL) {
                const baseImage = new Image();
                baseImage.onload = () => drawCanvas(baseImage);
                baseImage.src = dataURL;
            }
        };
        img.onerror = () => {
            console.error('Failed to load sticker:', src);
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
        
        // Update canvas
        const dataURL = localStorage.getItem('photoStrip');
        if (dataURL) {
            const baseImage = new Image();
            baseImage.onload = () => {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                ctx.drawImage(baseImage, 0, 0, WIDTH, HEIGHT);
                updatedStickers.forEach(s => {
                    ctx.drawImage(s.img, s.x, s.y, s.width, s.height);
                });
            };
            baseImage.src = dataURL;
        }
        
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
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    const handleReset = () => {
        setStickers([]);
        setSeaweedIndex(0);
        setBubbleIndex(0);
        
        // Redraw canvas tanpa sticker
        const dataURL = localStorage.getItem('photoStrip');
        if (dataURL) {
            const baseImage = new Image();
            baseImage.onload = () => {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                ctx.drawImage(baseImage, 0, 0, WIDTH, HEIGHT);
            };
            baseImage.src = dataURL;
        }
    };

    useEffect(() => {
        // Redraw canvas when stickers change
        if (isLoaded) {
            const dataURL = localStorage.getItem('photoStrip');
            if (dataURL) {
                const baseImage = new Image();
                baseImage.onload = () => drawCanvas(baseImage);
                baseImage.src = dataURL;
            }
        }
    }, [stickers, isLoaded]);

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
            </div>

            <div id="canvasContainer">
                <canvas 
                    id="finalCanvas"
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
                    style={{ 
                        cursor: selectedSticker ? 'grabbing' : 'grab',
                        width: '100%',
                        height: 'auto'
                    }}
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