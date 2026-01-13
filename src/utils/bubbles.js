export const initBubbles = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bubbleImages = [
        '/Assets/fish-photobooth/camerapage/bubbles/bubble4.png',
        '/Assets/fish-photobooth/camerapage/bubbles/bubble1.png',
        '/Assets/fish-photobooth/camerapage/bubbles/bubble2.png',
        '/Assets/fish-photobooth/camerapage/bubbles/bubble3.png',
        '/Assets/fish-photobooth/camerapage/bubbles/bubble5.png',
    ];

    const createBubble = () => {
        const bubble = document.createElement('img');
        bubble.src = bubbleImages[Math.floor(Math.random() * bubbleImages.length)];
        bubble.classList.add('bubble');

        bubble.style.left = Math.random() * 100 + 'vw';
        const size = 20 + Math.random() * 20;
        bubble.style.width = size + 'px';
        const duration = 12 + Math.random() * 8;
        bubble.style.animationDuration = duration + 's';

        bubble.addEventListener('animationend', () => {
            bubble.style.opacity = 0.2 + Math.random() * 0.8;
        });

        container.appendChild(bubble);

        setTimeout(() => {
            if (bubble.parentNode === container) {
                container.removeChild(bubble);
            }
        }, duration * 1000);
    };

    const intervalId = setInterval(createBubble, 400);

    return () => clearInterval(intervalId);
};