// Final page utility module
export const loadPhotoStrip = (canvas, setStickers) => {
    const dataURL = localStorage.getItem('photoStrip');
    if (!dataURL) {
        console.error('No photo found!');
        return null;
    }

    const img = new Image();
    img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = dataURL;

    return dataURL;
};

export const addSticker = (src, stickers, setStickers) => {
    const img = new Image();
    img.onload = () => {
        const newSticker = {
            img,
            x: 1176 / 2 - img.width / 6,
            y: 1470 / 2 - img.height / 6,
            width: img.width / 2.5,
            height: img.height / 2.5,
            dragging: false
        };
        setStickers([...stickers, newSticker]);
    };
    img.src = src;
};

export const drawCanvas = (canvas, backgroundImage, stickers) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundImage) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            stickers.forEach(s => ctx.drawImage(s.img, s.x, s.y, s.width, s.height));
        };
        img.src = backgroundImage;
    } else {
        stickers.forEach(s => ctx.drawImage(s.img, s.x, s.y, s.width, s.height));
    }
};

export const downloadPhoto = (canvas) => {
    canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'fish-photobooth.png';
        a.click();
    }, 'image/png');
};