import { useEffect } from "react";
import "../styles/RestaurantModal.css";

export default function RestaurantModal({ isOpen, onClose, restaurants }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="restaurant-modal-backdrop" onClick={handleBackdropClick}>
      <div className="restaurant-modal">
        <div className="restaurant-modal-header">
          <h2>흑백요리사 출연 셰프 식당 위치</h2>
          <button className="restaurant-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="restaurant-modal-content">
          {/* 백수저 섹션 */}
          <div className="restaurant-section">
            <h3 className="section-title">
              <span className="section-badge white">백수저 셰프</span>
            </h3>
            <div className="restaurant-list">
              {restaurants.백수저.map((item) => (
                <div key={item.id} className="restaurant-item">
                  <div className="restaurant-header">
                    <h4 className="restaurant-name">{item.restaurant}</h4>
                    <span className="chef-name">셰프 {item.chef}</span>
                  </div>

                  {item.locations ? (
                    <div className="restaurant-branches">
                      {item.locations.map((loc, idx) => (
                        <div key={idx} className="branch-item">
                          <span className="branch-label">{loc.branch}</span>
                          <p className="restaurant-address">{loc.address}</p>
                          <a
                            href={loc.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="map-link"
                          >
                            🗺️ 지도에서 보기
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="restaurant-address">{item.location}</p>
                      {item.note && <p className="restaurant-note">※ {item.note}</p>}
                      <a
                        href={item.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        🗺️ {item.isInternational ? "Google Maps에서 보기" : "지도에서 보기"}
                      </a>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 흑수저 섹션 */}
          <div className="restaurant-section">
            <h3 className="section-title">
              <span className="section-badge black">흑수저 셰프</span>
            </h3>
            <div className="restaurant-list">
              {restaurants.흑수저.map((item) => (
                <div key={item.id} className="restaurant-item">
                  <div className="restaurant-header">
                    <h4 className="restaurant-name">{item.restaurant}</h4>
                    <span className="chef-name">셰프 {item.chef}</span>
                  </div>

                  <p className="restaurant-address">{item.location}</p>
                  {item.note && <p className="restaurant-note">※ {item.note}</p>}
                  <a
                    href={item.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    🗺️ 지도에서 보기
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
