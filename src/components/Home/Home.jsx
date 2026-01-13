import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import styles from './Home.module.css'

const Home = () => {
    const navigate = useNavigate();
    const bubblesRef = useRef(null);
    const photoboothRef = useRef(null);
    const fishRefs = [useRef(null), useRef(null), useRef(null)];
    const photostripRef = useRef(null);

    const BUBBLE_FRAMES = [
        '/Assets/fish-photobooth/homepage/animated-bubbles-home/bubble-1.png',
        '/Assets/fish-photobooth/homepage/animated-bubbles-home/bubble-2.png',
        '/Assets/fish-photobooth/homepage/animated-bubbles-home/bubble-3.png',
    ];

    const PHOTOBOOTH_FRAMES = Array.from({ length: 16 }, (_, i) =>
        `/Assets/fish-photobooth/homepage/animated-photobooth-mock/${i + 1}.jpg`
    );

    useEffect(() => {
        const loadedFrames = PHOTOBOOTH_FRAMES.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        let currentFrame = 0;
        let direction = 1;
        let animationFrameId;

        const animatePhotobooth = () => {
            if (photoboothRef.current) {
                const frame = loadedFrames[currentFrame];
                if (frame.complete) {
                    photoboothRef.current.style.backgroundImage = `url('${frame.src}')`;
                    photoboothRef.current.style.opacity = '1';

                    currentFrame += direction;
                    if (currentFrame === 0 || currentFrame === loadedFrames.length - 1) {
                        direction *= -1;
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animatePhotobooth);
        };

        animatePhotobooth();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const startAnimations = () => {
        let bubbleFrame = 0;
        const bubbleInterval = setInterval(() => {
            if (bubblesRef.current) {
                bubblesRef.current.style.backgroundImage = `url('${BUBBLE_FRAMES[bubbleFrame]}')`;
                bubbleFrame = (bubbleFrame + 1) % BUBBLE_FRAMES.length;
            }
        }, 200);

        const fishDirections = [-1, 1, -1];
        const fishIntervals = fishRefs.map((ref, index) => {
            return setInterval(() => {
                if (ref.current) {
                    const currentRot = ref.current.style.transform.match(/-?\d+\.?\d*/)?.[0] || '0';
                    const newRot = (parseFloat(currentRot) + fishDirections[index] * 7.52) % 360;
                    ref.current.style.transform = `rotate(${newRot}deg)`;
                }
            }, 200);
        });

        let photostripRotation = 0;
        const photostripInterval = setInterval(() => {
            if (photostripRef.current) {
                photostripRotation = photostripRotation === 16.52 ? 0 : 16.52;
                photostripRef.current.style.transform = `rotate(${photostripRotation}deg)`;
            }
        }, 300);

        const intervals = [bubbleInterval, ...fishIntervals, photostripInterval];

        return () => {
            intervals.forEach(clearInterval);
        };
    };

    const handleSelectClick = () => {
        navigate('/menu');
    };

    return (
        <div className="home-container">
            <Logo />

            <div className="photobooth-container">
                <div
                    ref={photoboothRef}
                    className={`photobooth-mock ${styles.photoboothMock}`}
                />
                <div
                    ref={photostripRef}
                    className={`photostrip-mock ${styles.photostripMock}`}
                />
                <div
                    ref={bubblesRef}
                    className={`bubbles-mock ${styles.bubblesMock}`}
                />
                <div
                    ref={fishRefs[0]}
                    className={`fish-mock-1 ${styles.fishMock}`}
                />
                <div
                    ref={fishRefs[1]}
                    className={`fish-mock-2 ${styles.fishMock}`}
                />
                <div
                    ref={fishRefs[2]}
                    className={`fish-mock-3 ${styles.fishMock}`}
                />
            </div>

            <div className="button-container">
                <button
                    id="select-button"
                    className={styles.selectButton}
                    onMouseEnter={startAnimations}
                    onClick={handleSelectClick}
                >
                    Select
                </button>
            </div>
        </div>
    );
};

export default Home;