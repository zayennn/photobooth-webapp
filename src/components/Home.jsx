import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Home = () => {
    const navigate = useNavigate();
    const [isAnimating, setIsAnimating] = useState(false);
    const bubbleRef = useRef(null);
    const photoboothRef = useRef(null);
    const photostripRef = useRef(null);
    const fishRefs = [useRef(null), useRef(null), useRef(null)];

    const bubbleFrames = [
        'Assets/fish-photobooth/homepage/animated-bubbles-home/bubble-1.png',
        'Assets/fish-photobooth/homepage/animated-bubbles-home/bubble-2.png',
        'Assets/fish-photobooth/homepage/animated-bubbles-home/bubble-3.png',
    ];

    const photoboothFrames = Array.from({ length: 16 }, (_, i) =>
        `Assets/fish-photobooth/homepage/animated-photobooth-mock/${i + 1}.jpg`
    );

    useEffect(() => {
        let bubbleInterval;
        let fishIntervals = [];
        let photoboothInterval;
        let currentBubbleFrame = 0;
        let currentPhotoboothFrame = 0;
        let photoboothDirection = 1;

        if (isAnimating) {
            // Bubble animation
            bubbleInterval = setInterval(() => {
                if (bubbleRef.current) {
                    bubbleRef.current.style.backgroundImage = `url('${bubbleFrames[currentBubbleFrame]}')`;
                    currentBubbleFrame = (currentBubbleFrame + 1) % bubbleFrames.length;
                }
            }, 200);

            // Fish animations
            const fishDirections = [-1, 1, -1];
            fishIntervals = fishRefs.map((ref, index) => {
                return setInterval(() => {
                    if (ref.current) {
                        const rotation = fishDirections[index] * 7.52;
                        ref.current.style.transform = `rotate(${rotation}deg)`;
                        fishDirections[index] *= -1;
                    }
                }, 200);
            });

            // Photostrip animation
            const photostripInterval = setInterval(() => {
                if (photostripRef.current) {
                    const rotation = photostripRef.current.style.transform.includes('16.52deg') ? '0deg' : '16.52deg';
                    photostripRef.current.style.transform = `rotate(${rotation})`;
                }
            }, 300);

            // Photobooth animation
            photoboothInterval = setInterval(() => {
                if (photoboothRef.current) {
                    const frame = photoboothFrames[currentPhotoboothFrame];
                    photoboothRef.current.style.backgroundImage = `url('${frame}')`;
                    photoboothRef.current.style.opacity = '1';

                    currentPhotoboothFrame += photoboothDirection;
                    if (currentPhotoboothFrame === 0 || currentPhotoboothFrame === photoboothFrames.length - 1) {
                        photoboothDirection *= -1;
                    }
                }
            }, 200);

            return () => {
                clearInterval(bubbleInterval);
                fishIntervals.forEach(interval => clearInterval(interval));
                clearInterval(photostripInterval);
                clearInterval(photoboothInterval);
            };
        }
    }, [isAnimating]);

    const handleMouseEnter = () => {
        setIsAnimating(true);
    };

    const handleMouseLeave = () => {
        setIsAnimating(false);
        // Reset animations
        if (bubbleRef.current) {
            bubbleRef.current.style.backgroundImage = `url('${bubbleFrames[0]}')`;
        }
        fishRefs.forEach(ref => {
            if (ref.current) ref.current.style.transform = 'rotate(0deg)';
        });
        if (photostripRef.current) {
            photostripRef.current.style.transform = 'rotate(16.52deg)';
        }
    };

    return (
        <div className="home-page">
            <Logo />

            <div className="home-container">
                <div className="photobooth-container">
                    <div
                        ref={photoboothRef}
                        className="photobooth-mock"
                        style={{
                            backgroundImage: `url('${photoboothFrames[0]}')`
                        }}
                    />
                    <div
                        ref={photostripRef}
                        className="photostrip-mock"
                    />
                    <div
                        ref={bubbleRef}
                        className="bubbles-mock"
                    />
                    <div ref={fishRefs[0]} className="fish-mock-1" />
                    <div ref={fishRefs[1]} className="fish-mock-2" />
                    <div ref={fishRefs[2]} className="fish-mock-3" />
                </div>

                <div className="button-container">
                    <button
                        id="select-button"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => navigate('/menu')}
                    >
                        Select
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;