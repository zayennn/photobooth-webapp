import React, { useEffect, useRef } from 'react';

const BubbleAnimation = () => {
    const containerRef = useRef(null);
    const bubbleImages = [
        "Assets/fish-photobooth/camerapage/bubbles/bubble4.png",
        "Assets/fish-photobooth/camerapage/bubbles/bubble1.png",
        "Assets/fish-photobooth/camerapage/bubbles/bubble2.png",
        "Assets/fish-photobooth/camerapage/bubbles/bubble3.png",
        "Assets/fish-photobooth/camerapage/bubbles/bubble4.png",
        "Assets/fish-photobooth/camerapage/bubbles/bubble5.png",
        "Assets/fish-photobooth/camerapage/bubbles/bubble4.png"
    ];

    useEffect(() => {
        const createBubble = () => {
            if (!containerRef.current) return;

            const bubble = document.createElement("img");
            bubble.src = bubbleImages[Math.floor(Math.random() * bubbleImages.length)];
            bubble.classList.add("bubble");

            // Random position, size, duration
            bubble.style.left = Math.random() * 100 + "vw";
            const size = 20 + Math.random() * 20;
            bubble.style.width = size + "px";
            const duration = 12 + Math.random() * 8;
            bubble.style.animationDuration = duration + "s";

            // Random final opacity
            bubble.addEventListener("animationend", () => {
                bubble.style.opacity = 0.2 + Math.random() * 0.8;
            });

            containerRef.current.appendChild(bubble);

            // Remove after animation
            setTimeout(() => {
                if (bubble.parentNode === containerRef.current) {
                    containerRef.current.removeChild(bubble);
                }
            }, duration * 1000);
        };

        const interval = setInterval(createBubble, 400);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="bubble-container"
        />
    );
};

export default BubbleAnimation;