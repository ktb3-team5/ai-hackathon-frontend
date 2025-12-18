import { useRef, useState, useEffect } from "react";
import "../styles/WorkationSection.css";
import { api } from "../services/api";

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
  const [mediaList, setMediaList] = useState([]);
  const marqueeRef = useRef(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 미디어 TOP 10 가져오기
    const fetchMedia = async () => {
      try {
        const data = await api.getTop10Media();
        setMediaList(data);
      } catch (error) {
        console.error('Failed to fetch media:', error);
      }
    };
    fetchMedia();
  }, []);

  const handleClick = (mediaId) => {
    if (onSelectImage && !hasDragged.current) {
      onSelectImage(mediaId);
    }
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
          {(mediaList.length > 0 ? [...mediaList, ...mediaList] : [...IMAGES, ...IMAGES]).map((item, idx) => {
            const src = item.posterUrl || item;
            const mediaId = item.id;
            const title = item.title || '';
            return (
              <button
                type="button"
                className="image-item"
                key={idx}
                onClick={() => handleClick(mediaId)}
                aria-label={`Open travel recommendation for ${title}`}
              >
                <img src={src} alt={title} draggable={false} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
