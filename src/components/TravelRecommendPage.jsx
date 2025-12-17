import { useEffect, useState } from "react";
import "../styles/TravelRecommendPage.css";
import RestaurantModal from "./RestaurantModal";
import { RESTAURANT_DATA } from "../data/restaurants";

export default function TravelRecommendPage({ userPreferences, onBack }) {
  // 흑백요리사 여행/맛집 추천 전용 페이지
  const allRestaurants = [...RESTAURANT_DATA.백수저, ...RESTAURANT_DATA.흑수저];

  const topRestaurants = allRestaurants.slice(0, 5);
  const ourPickRestaurants = allRestaurants.slice(5, 10);
  const nearbyRestaurants = allRestaurants.slice(10, 15);

  const age =
    userPreferences?.birthYear &&
    new Date().getFullYear() - parseInt(userPreferences.birthYear);

  const showRestaurantButton = true;

  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <section className="travel-page">
      <header className="travel-header">
        {onBack && (
          <button className="travel-back-btn" onClick={onBack}>
            ← 뒤로가기
          </button>
        )}

        <p className="travel-label">콘텐츠 기반 여행 추천</p>
        <h1 className="travel-title">
          <span className="travel-title-main">흑백요리사</span>
          <span className="travel-title-sub">를 좋아하는 당신에게,</span>
          <br />
          이런 한국 여행은 어떠세요?
        </h1>

        {age && (
          <p className="travel-meta">
            {age}대 {userPreferences.gender === "female" ? "여성" : "남성"}{" "}
            여행자를 위한 추천 코스예요.
          </p>
        )}

        <p className="travel-desc">
          K-콘텐츠가 촉발한 감정을 그대로 이어갈 수 있는 실제 여행과 맛집 루트를
          큐레이션했어요.
        </p>
        <div className="travel-theme-badge">
          <span className="badge-label">여행 테마</span>
          <span className="badge-text">셰프 맛집 성지순례</span>
        </div>
      </header>

      {/* 1. 방송 속 맛집 TOP 5 */}
      <section className="travel-section">
        <h2 className="section-title">방송 속 화제의 맛집 TOP 5</h2>
        <p className="section-subtitle">
          흑백요리사에 등장한 레스토랑 중 화제성이 높은 곳만 추려서 보여드려요.
        </p>

        <div className="card-row">
          {topRestaurants.map((item) => (
            <article key={item.id} className="restaurant-card">
              {/* 🔽 썸네일 추가 */}
              <div className="restaurant-thumb">
                <img
                  src={`https://picsum.photos/seed/${item.id}/400/260`}
                  alt={item.restaurant}
                />
              </div>
              <div className="restaurant-card-header">
                <span className="restaurant-chip">TOP PICK</span>
                <span className="restaurant-chef">셰프 {item.chef}</span>
              </div>
              <h3 className="restaurant-name">{item.restaurant}</h3>
              <p className="restaurant-location">
                {item.locations ? item.locations[0].address : item.location}
              </p>
              <button
                className="restaurant-map-btn"
                onClick={() => setIsRestaurantModalOpen(true)}
              >
                🗺️ 지도에서 보기
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* 2. 우리가 추천하는 코스 맛집 5곳 */}
      <section className="travel-section">
        <h2 className="section-title">여행 코스로 묶기 좋은 추천 맛집 5곳</h2>
        <p className="section-subtitle">
          같은 동선 안에서 여러 곳을 들를 수 있도록, 코스로 묶기 좋은 레스토랑만
          골랐어요.
        </p>

        <div className="card-row">
          {ourPickRestaurants.map((item) => (
            <article key={item.id} className="restaurant-card">
              {/* 🔽 썸네일 추가 */}
              <div className="restaurant-thumb">
                <img
                  src={`https://picsum.photos/seed/${item.id}/400/260`}
                  alt={item.restaurant}
                />
              </div>
              <div className="restaurant-card-header">
                <span className="restaurant-chip">코스 추천</span>
                <span className="restaurant-chef">셰프 {item.chef}</span>
              </div>
              <h3 className="restaurant-name">{item.restaurant}</h3>
              <p className="restaurant-location">
                {item.locations ? item.locations[0].address : item.location}
              </p>
              <button
                className="restaurant-map-btn"
                onClick={() => setIsRestaurantModalOpen(true)}
              >
                🗺️ 지도에서 보기
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* 3. 주변에서 함께 가기 좋은 근처 맛집 5곳 */}
      <section className="travel-section">
        <h2 className="section-title">
          여행 중 근처에서 함께 가기 좋은 맛집 5곳
        </h2>
        <p className="section-subtitle">
          여행 동선 근처에 있어, 일정 사이에 가볍게 들르기 좋은 식당들이에요.
        </p>

        <div className="card-row">
          {nearbyRestaurants.map((item) => (
            <article key={item.id} className="restaurant-card">
              {/* 🔽 썸네일 추가 */}
              <div className="restaurant-thumb">
                <img
                  src={`https://picsum.photos/seed/${item.id}/400/260`}
                  alt={item.restaurant}
                />
              </div>
              <div className="restaurant-card-header">
                <span className="restaurant-chip">근처 추천</span>
                <span className="restaurant-chef">셰프 {item.chef}</span>
              </div>
              <h3 className="restaurant-name">{item.restaurant}</h3>
              <p className="restaurant-location">
                {item.locations ? item.locations[0].address : item.location}
              </p>
              <button
                className="restaurant-map-btn"
                onClick={() => setIsRestaurantModalOpen(true)}
              >
                🗺️ 지도에서 보기
              </button>
            </article>
          ))}
        </div>
      </section>

      {showRestaurantButton && (
        <RestaurantModal
          isOpen={isRestaurantModalOpen}
          onClose={() => setIsRestaurantModalOpen(false)}
          restaurants={RESTAURANT_DATA}
        />
      )}
    </section>
  );
}
