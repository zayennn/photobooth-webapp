let stream = null;

export const setupCamera = async (videoElement) => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 2560 },
                height: { ideal: 1440 },
                facingMode: 'user'
            },
            audio: false
        });

        videoElement.srcObject = stream;
        videoElement.play();
        videoElement.style.display = 'block';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.width = '100%';
        videoElement.style.height = '50%';
    } catch (err) {
        console.error('Camera access failed:', err);
        alert('Camera access failed: ' + err.message);
    }
};

export const capturePhoto = (video, ctx, photoStage, callback) => {
    const WIDTH = 1176;
    const HALF = 1470 / 2;
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

    if (callback) callback();
};

export const cleanupCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
};