import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import BubbleAnimation from './BubbleAnimation';
import './Upload.css';

const Upload = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const WIDTH = 1176;
  const HEIGHT = 1470;
  const HALF = HEIGHT / 2;

  const [photoStage, setPhotoStage] = useState(0); // 0=top, 1=bottom, 2=done
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [originalImages, setOriginalImages] = useState([null, null]);
  const [uploadedImages, setUploadedImages] = useState([null, null]);
  const [cropPosition, setCropPosition] = useState([0.5, 0.5]);

  useEffect(() => {
    localStorage.removeItem('photoStrip');
  }, []);

  /* ================= DRAW ================= */
  const drawCroppedPhoto = (img, cropPos) => {
    if (!canvasRef.current || !img) return;

    const ctx = canvasRef.current.getContext('2d');
    const yOffset = photoStage === 0 ? 0 : HALF;

    ctx.clearRect(0, yOffset, WIDTH, HALF);

    const imgAspect = img.width / img.height;
    const targetAspect = WIDTH / HALF;

    let sx = 0, sy = 0, sw, sh;

    if (imgAspect > targetAspect) {
      sh = img.height;
      sw = sh * targetAspect;
      const maxCropX = img.width - sw;
      sx = maxCropX * cropPos;
    } else {
      sw = img.width;
      sh = sw / targetAspect;
      const maxCropY = img.height - sh;
      sy = maxCropY * cropPos;
    }

    ctx.save();
    if (photoStage === 1) {
      ctx.translate(WIDTH, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
    } else {
      ctx.drawImage(img, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
    }
    ctx.restore();
  };

  /* ================= UPLOAD ================= */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const originals = [...originalImages];
        originals[photoStage] = img;
        setOriginalImages(originals);

        const crops = [...cropPosition];
        crops[photoStage] = 0.5;
        setCropPosition(crops);

        drawCroppedPhoto(img, 0.5);
        setIsLoading(false);
      };
      img.onerror = () => {
        alert('Failed to load image');
        setIsLoading(false);
      };
      img.src = ev.target.result;
    };
    
    reader.onerror = () => {
      alert('Failed to read file');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
    fileInputRef.current.value = '';
  };

  /* ================= SLIDER ================= */
  const handleCropChange = (value) => {
    if (!originalImages[photoStage]) return;

    const v = parseFloat(value);
    const crops = [...cropPosition];
    crops[photoStage] = v;
    setCropPosition(crops);

    drawCroppedPhoto(originalImages[photoStage], v);
  };

  /* ================= CONFIRM ================= */
  const handleConfirmCrop = () => {
    if (!canvasRef.current || !originalImages[photoStage]) return;

    const uploaded = canvasRef.current.toDataURL('image/png');
    const uploadedArr = [...uploadedImages];
    uploadedArr[photoStage] = uploaded;
    setUploadedImages(uploadedArr);

    if (photoStage === 0) {
      setPhotoStage(1);
    } else if (photoStage === 1) {
      setPhotoStage(2);
      setTimeout(finalizePhotoStrip, 100);
    }
  };

  /* ================= FRAME ================= */
  const finalizePhotoStrip = () => {
    setIsLoading(true);
    const ctx = canvasRef.current.getContext('2d');
    const frame = new Image();
    
    frame.onload = () => {
      ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
      setIsReady(true);
      setIsLoading(false);
    };
    
    frame.onerror = () => {
      alert('Failed to load frame');
      setIsLoading(false);
    };
    
    frame.src = '/Assets/fish-photobooth/camerapage/frame.png';
  };

  /* ================= ACTIONS ================= */
  const handleReady = () => {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    localStorage.setItem('photoStrip', dataUrl);
    navigate('/final');
  };

  const handleDownload = () => {
    canvasRef.current.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fish-photobooth-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const getStageText = () => {
    if (photoStage === 0) return '📷 Adjust Top Photo';
    if (photoStage === 1) return '📷 Adjust Bottom Photo';
    return '✅ Ready to Decorate!';
  };

  const getPositionText = () => {
    const pos = cropPosition[photoStage];
    if (pos === 0.5) return 'Center';
    if (pos < 0.5) return `Top ${Math.round((0.5 - pos) * 100)}%`;
    return `Bottom ${Math.round((pos - 0.5) * 100)}%`;
  };

  return (
    <div className="upload-page">
      <Logo />

      <div className="upload-container">
        <div className="photobooth-container">
          <BubbleAnimation />

          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
          />

          <img
            className="frame-overlay"
            src="/Assets/fish-photobooth/camerapage/frame.png"
            alt="frame"
          />
        </div>

        {/* ===== CROP PANEL ===== */}
        <div className="crop-control-panel">
          <h2>{getStageText()}</h2>

          {/* Status Indicators */}
          <div className="status-indicator">
            <div className="status-item">
              <div className={`status-dot ${photoStage >= 0 ? 'active' : ''} ${originalImages[0] ? 'completed' : ''}`}></div>
              <span className="status-label">Top Photo</span>
            </div>
            <div className="status-item">
              <div className={`status-dot ${photoStage >= 1 ? 'active' : ''} ${originalImages[1] ? 'completed' : ''}`}></div>
              <span className="status-label">Bottom Photo</span>
            </div>
            <div className="status-item">
              <div className={`status-dot ${isReady ? 'completed' : 'pending'}`}></div>
              <span className="status-label">Frame</span>
            </div>
          </div>

          {/* Vertical Slider Container */}
          <div className="vertical-slider-container">
            <div className="slider-labels">
              <span className="slider-label">Top</span>
              <span className="slider-label">Center</span>
              <span className="slider-label">Bottom</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={cropPosition[photoStage]}
              onChange={(e) => handleCropChange(e.target.value)}
              className="vertical-slider"
              disabled={!originalImages[photoStage] || photoStage >= 2}
            />
            
            <div className="position-indicator">
              Position: {getPositionText()}
            </div>
          </div>

          {originalImages[photoStage] && photoStage < 2 && (
            <button
              className="control-btn confirm-btn"
              onClick={handleConfirmCrop}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  {photoStage === 0 ? 'Confirm Top Photo' : 'Confirm Bottom Photo'}
                </>
              )}
            </button>
          )}

          {/* Instructions Tooltip */}
          <div className="tooltip" style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span style={{ color: '#666', fontSize: '0.9rem', cursor: 'help' }}>
              💡 Need help? Hover here
            </span>
            <div className="tooltiptext">
              • Drag the slider to adjust photo position<br/>
              • Upload top photo first, then bottom<br/>
              • Click confirm after adjusting each photo
            </div>
          </div>
        </div>
      </div>

      <div className="upload-controls">
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={photoStage >= 2 || isLoading}
        >
          {isLoading ? '📤 Uploading...' : '📤 Upload Photo'}
        </button>

        {isReady && (
          <>
            <button onClick={handleReady} disabled={isLoading}>
              🎨 Go to Decorate
            </button>
            <button onClick={handleDownload} disabled={isLoading}>
              ⬇️ Download Photo
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default Upload;