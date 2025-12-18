import React, { useState, useRef, useEffect } from "react";
import "../styles/TimeSlip.css";

// Icons
const IconBase = ({ children, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const CameraIcon = (props) => <IconBase {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></IconBase>;
const ArrowLeft = (props) => <IconBase {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></IconBase>;
const Download = (props) => <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></IconBase>;
const Upload = (props) => <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></IconBase>;
const Sparkles = (props) => <IconBase {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></IconBase>;
const Scan = (props) => <IconBase {...props}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></IconBase>;
const Layers = (props) => <IconBase {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></IconBase>;

const CONCEPT_DATA = [
  {
    id: 'goblin',
    title: 'TIME SLIP',
    location: 'JUMUNJIN BREAKWATER',
    year: '2016',
    bgImage: 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=2940&auto=format&fit=crop',
    funPhrases: [
      "PERFECT SYNCHRONIZATION",
      "DRAMA MODE ACTIVATED",
      "MEMORY OVERLAP COMPLETE",
      "YOU ARE THE SCENE"
    ],
    feedbacks: [
      { range: [95, 100], text: "PERFECT. You are the protagonist." },
      { range: [90, 94], text: "EXCELLENT. Just check your gaze." },
      { range: [80, 89], text: "GOOD. Try lowering the angle." },
      { range: [70, 79], text: "AVERAGE. Move slightly left." },
      { range: [0, 69], text: "RETRY. Align with the horizon." }
    ],
    scenes: [
      {
        id: 1,
        img: 'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=1000&auto=format&fit=crop',
        guideText: "ALIGN HORIZON LINE"
      },
      {
        id: 2,
        img: 'https://images.unsplash.com/photo-1515404929826-76fff9fef6fe?q=80&w=1000&auto=format&fit=crop',
        guideText: "MATCH CHARACTER POSITION"
      }
    ],
  }
];

export default function TimeSlip({ onClose }) {
  const [step, setStep] = useState('home');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [userImage, setUserImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [flash, setFlash] = useState(false);
  const [finalImage, setFinalImage] = useState(null);
  const [randomScore, setRandomScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedConcept = CONCEPT_DATA[0];

  const startCamera = async () => {
    setUserImage(null);
    setStep('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied.");
      setStep('home');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUserImage(e.target.result);
      setStep('compare');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setUserImage(dataUrl);
    setTimeout(() => setStep('compare'), 600);
  };

  const startAnalysis = () => {
    setStep('analyzing');
    const score = Math.floor(Math.random() * (99 - 85 + 1)) + 85;
    setRandomScore(score);
    const foundFeedback = selectedConcept.feedbacks.find(f => score >= f.range[0] && score <= f.range[1]);
    setFeedback(foundFeedback ? foundFeedback.text : "TRY AGAIN.");
    setTimeout(() => {
      setStep('result');
    }, 2500);
  };

  useEffect(() => {
    if (step === 'result' && userImage) {
      generateCleanTechImage();
    }
  }, [step, userImage]);

  const generateCleanTechImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const canvasWidth = 1080;
    const canvasHeight = 1920;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = 'rgba(37, 99, 235, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasWidth; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvasHeight); ctx.stroke();
    }
    for (let j = 0; j < canvasHeight; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvasWidth, j); ctx.stroke();
    }

    const beforeImg = new Image();
    beforeImg.crossOrigin = "Anonymous";
    beforeImg.src = selectedConcept.scenes[currentSceneIndex].img;
    const afterImg = new Image();
    afterImg.src = userImage;

    Promise.all([
      new Promise(resolve => beforeImg.onload = resolve),
      new Promise(resolve => afterImg.onload = resolve)
    ]).then(() => {
      const margin = 80;
      const cardW = canvasWidth - (margin * 2);
      const cardH = 650;
      const startY = 320;
      const gap = 80;

      ctx.fillStyle = '#0f172a';
      ctx.font = "900 110px sans-serif";
      ctx.textAlign = 'left';
      ctx.letterSpacing = '-4px';
      ctx.fillText("TIME SLIP", margin, 200);

      ctx.fillStyle = '#2563eb';
      ctx.font = "700 30px sans-serif";
      ctx.textAlign = 'right';
      ctx.letterSpacing = '1px';
      ctx.fillText(`SYNC RATE ${randomScore}%`, canvasWidth - margin, 190);

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(margin, 240);
      ctx.lineTo(canvasWidth - margin, 240);
      ctx.stroke();

      const drawTechCard = (img, x, y, label, isUser) => {
        ctx.shadowColor = "rgba(148, 163, 184, 0.4)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 10;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 4);
        ctx.clip();
        drawImageProp(ctx, img, x, y, cardW, cardH);
        ctx.restore();

        ctx.shadowColor = "transparent";
        ctx.lineWidth = 4;
        if (isUser) {
          const grad = ctx.createLinearGradient(x, y, x + cardW, y + cardH);
          grad.addColorStop(0, '#2563eb');
          grad.addColorStop(1, '#06b6d4');
          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle = '#e2e8f0';
        }
        ctx.strokeRect(x, y, cardW, cardH);

        const tagW = 200;
        const tagH = 50;
        ctx.fillStyle = isUser ? '#2563eb' : '#0f172a';
        ctx.fillRect(x, y - 25, tagW, tagH);

        ctx.fillStyle = '#ffffff';
        ctx.font = "700 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = '1px';
        ctx.fillText(label, x + tagW / 2, y);
      };

      drawTechCard(beforeImg, margin, startY, "REFERENCE", false);
      drawTechCard(afterImg, margin, startY + cardH + gap, "YOUR SHOT", true);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(margin + 20, startY + cardH);
      ctx.lineTo(margin + 20, startY + cardH + gap);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(margin + 20, startY + cardH + gap / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const footerY = canvasHeight - 200;

      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(margin, footerY, cardW, 140, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = "600 24px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("AI ANALYSIS FEEDBACK", margin + 40, footerY + 30);

      const phrase = selectedConcept.funPhrases[Math.floor(Math.random() * selectedConcept.funPhrases.length)];
      ctx.fillStyle = '#0f172a';
      ctx.font = "700 36px sans-serif";
      ctx.fillText(`"${phrase}"`, margin + 40, footerY + 75);

      setFinalImage(canvas.toDataURL('image/png'));
    });
  };

  const drawImageProp = (ctx, img, x, y, w, h) => {
    const offsetX = 0.5;
    const offsetY = 0.5;
    const iw = img.width, ih = img.height;
    const r = Math.min(w / iw, h / ih);
    let nw = iw * r, nh = ih * r;
    let ar = 1;
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar; nh *= ar;
    let cw = iw / (nw / w); let ch = ih / (nh / h);
    let cx = (iw - cw) * offsetX; let cy = (ih - ch) * offsetY;
    if (cx < 0) cx = 0; if (cy < 0) cy = 0; if (cw > iw) cw = iw; if (ch > ih) ch = ih;
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  };

  const renderContent = () => {
    if (step === 'home') {
      return (
        <div className="timeslip-home">
          <button className="timeslip-close-btn" onClick={onClose}>✕</button>

          <div className="timeslip-hero">
            <span className="timeslip-badge">Beta Experience</span>
            <h1 className="timeslip-title">
              TIME SLIP<br />
              <span className="timeslip-title-gradient">INTO THE SCENE</span>
            </h1>
            <p className="timeslip-desc">
              Connect with legendary K-Drama moments. Analyze your sync rate with AI technology.
            </p>

            <div className="timeslip-actions">
              <button onClick={startCamera} className="timeslip-btn-primary">
                <CameraIcon size={20} />
                Start Camera
              </button>
              <button onClick={triggerFileUpload} className="timeslip-btn-secondary">
                <Upload size={20} />
                Upload Image
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="timeslip-preview">
            <img src={selectedConcept.scenes[0].img} alt="Preview" />
            <div className="timeslip-preview-footer">
              <div>
                <span className="timeslip-preview-label">Target Scene</span>
                <span className="timeslip-preview-title">Goblin (2016)</span>
              </div>
              <div className="timeslip-preview-icon">
                <Sparkles size={24} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step === 'camera') {
      return (
        <div className="timeslip-camera">
          <div className="timeslip-camera-view">
            <video ref={videoRef} autoPlay playsInline></video>
            <div className="timeslip-ghost-overlay" style={{ opacity: opacity }}>
              <img src={selectedConcept.scenes[currentSceneIndex].img} alt="Guide" />
            </div>

            <div className="timeslip-camera-header">
              <button onClick={() => setStep('home')} className="timeslip-back-btn">
                <ArrowLeft size={20} />
              </button>
              <div className="timeslip-guide-badge">Guide Mode</div>
            </div>

            <div className="timeslip-guide-text">
              <p>{selectedConcept.scenes[currentSceneIndex].guideText}</p>
            </div>

            <div className="timeslip-opacity-slider">
              <Layers size={18} />
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                orient="vertical"
              />
            </div>
          </div>

          <div className="timeslip-camera-actions">
            <button onClick={captureImage} className="timeslip-capture-btn">
              <div className="timeslip-capture-inner"></div>
            </button>
          </div>

          {flash && <div className="timeslip-flash"></div>}
        </div>
      );
    }

    if (step === 'compare') {
      return (
        <div className="timeslip-compare">
          <div className="timeslip-compare-header">
            <button onClick={() => setStep('home')}><ArrowLeft /></button>
            <span>Sync Check</span>
            <div></div>
          </div>

          <div className="timeslip-compare-cards">
            <div className="timeslip-compare-card">
              <div className="timeslip-card-tag">Original</div>
              <img src={selectedConcept.scenes[currentSceneIndex].img} alt="Original" />
            </div>

            <div className="timeslip-compare-card active">
              <div className="timeslip-card-tag active">Your Shot</div>
              <img src={userImage} alt="Your shot" />
            </div>
          </div>

          <div className="timeslip-compare-actions">
            <button onClick={startAnalysis} className="timeslip-btn-primary">
              <Scan size={18} /> Analyze Sync Rate
            </button>
            <button onClick={() => setStep('camera')} className="timeslip-retake-btn">
              Retake Photo
            </button>
          </div>
        </div>
      );
    }

    if (step === 'analyzing') {
      return (
        <div className="timeslip-analyzing">
          <div className="timeslip-analyzing-bg">
            <div className="timeslip-analyzing-half">
              <img src={selectedConcept.scenes[currentSceneIndex].img} alt="Reference" />
              <div className="timeslip-scan-line"></div>
            </div>
            <div className="timeslip-analyzing-half">
              <img src={userImage} alt="User" />
              <div className="timeslip-scan-line" style={{ animationDelay: '0.1s' }}></div>
            </div>
          </div>

          <div className="timeslip-analyzing-content">
            <Sparkles className="timeslip-analyzing-icon" />
            <h2>Analyzing</h2>
            <p>CALCULATING SYNC RATE</p>
          </div>
        </div>
      );
    }

    if (step === 'result') {
      return (
        <div className="timeslip-result">
          <div className="timeslip-result-header">
            <button onClick={() => setStep('home')}><ArrowLeft size={20} /></button>
            <span>Analysis Report</span>
            <button onClick={onClose} className="timeslip-close-small">✕</button>
          </div>

          <div className="timeslip-result-image">
            {finalImage ? (
              <img src={finalImage} alt="Result" />
            ) : (
              <div className="timeslip-result-loading">Generating...</div>
            )}
          </div>

          <div className="timeslip-result-actions">
            <a href={finalImage} download="TimeSlip_Result.png" className="timeslip-btn-primary">
              <Download size={18} /> Save Image
            </a>
            <button onClick={startCamera} className="timeslip-btn-secondary">
              Try Again
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      );
    }
  };

  return (
    <div className="timeslip-modal-overlay" onClick={onClose}>
      <div className="timeslip-modal-content" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
}
