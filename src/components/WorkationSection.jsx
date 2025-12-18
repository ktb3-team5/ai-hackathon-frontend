import { useRef, useState } from "react";
import "../styles/WorkationSection.css";

const IMAGES = [
  "/images/top1.png",
  "/images/top2.png",
  "/images/top3.png",
  "/images/top4.png",
  "/images/top5.png",
  "/images/top6.png",
  "/images/top7.png",
  "/images/top9.png",
  "/images/top10.png",
  "/images/img1.png",
  "/images/img2.png",
  "/images/img3.png",
  "/images/img4.png",
];

export default function WorkationSection({ onSelectImage, onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const marqueeRef = useRef(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);
  const handleClick = () => {
    if (onSelectImage) onSelectImage();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(keyword);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const marquee = marqueeRef.current;
    if (!marquee) return;
    isPointerDown.current = true;
    hasDragged.current = false;
    dragState.current = {
      startX: e.pageX - marquee.offsetLeft,
      scrollLeft: marquee.scrollLeft,
    };
  };

  const handleMouseMove = (e) => {
    if (!isPointerDown.current) return;
    const marquee = marqueeRef.current;
    if (!marquee) return;
    const x = e.pageX - marquee.offsetLeft;
    const delta = x - dragState.current.startX;
    if (!hasDragged.current && Math.abs(delta) > 4) {
      hasDragged.current = true;
      setIsDragging(true);
    }
    if (hasDragged.current) {
      e.preventDefault();
      const walk = delta * 1.5;
      marquee.scrollLeft = dragState.current.scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    isPointerDown.current = false;
    if (hasDragged.current) {
      setIsDragging(false);
    }
    hasDragged.current = false;
  };

  return (
    <section className="workation">
      <div className="workation-text">
        {/* 🔍 SEARCH BAR */}
        <form className="workation-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="workation-search-input"
            placeholder="Search a K-drama, actor, or place"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="workation-search-btn">
            🔍
          </button>
        </form>
        <h2 className="workation-title">DISCOVER K-DRAMA LOCATIONS</h2>
        <p className="workation-sub">
          Choose a K-Drama you love.
          <br />
          We’ll show you where to go in Korea.
        </p>
      </div>
      <div
        className={`image-marquee${isDragging ? " is-dragging" : ""}`}
        ref={marqueeRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="image-track scrollable">
          {[...IMAGES, ...IMAGES].map((src, idx) => (
            <button
              type="button"
              className="image-item"
              key={idx}
              onClick={handleClick}
              aria-label="Open travel recommendation"
            >
              <img src={src} alt="" draggable={false} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
