import { useEffect, useRef, useState } from "react";
import "../styles/TravelRecommendPage.css";
import { RESTAURANT_DATA } from "../data/restaurants";
import { api } from "../services/api";

export default function TravelRecommendPage({ userPreferences, selectedMediaId, onBack, onOpenTimeSlip }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Travel and restaurant recommendations for Black & White Chef fans
  const allRestaurants = [...RESTAURANT_DATA.백수저, ...RESTAURANT_DATA.흑수저];

  const topRestaurants = allRestaurants.slice(0, 5);
  const ourPickRestaurants = allRestaurants.slice(5, 10);
  const nearbyRestaurants = allRestaurants.slice(10, 15);

  const age =
    userPreferences?.birthYear &&
    new Date().getFullYear() - parseInt(userPreferences.birthYear);

  /** 🔥 reveal 대상 refs */
  const revealRefs = useRef([]);

  useEffect(() => {
    // 선택한 미디어의 여행지 추천 가져오기
    const fetchDestinations = async () => {
      if (!selectedMediaId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await api.getTop3Destinations(selectedMediaId);
        setDestinations(data);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [selectedMediaId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  /** ✅ Google Maps 열기 (식당명 + 주소) */
  const openGoogleMap = (restaurantName, address) => {
    if (!restaurantName && !address) return;

    const query = encodeURIComponent(
      `${restaurantName ?? ""} ${address ?? ""}`.trim()
    );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /** 주소 안전 추출 */
  const getAddress = (item) =>
    item.locations ? item.locations[0].address : item.location;

  return (
    <section className="travel-page">
      <header
        className="travel-header reveal"
        ref={(el) => revealRefs.current.push(el)}
      >
        {onBack && (
          <button className="travel-back-btn" onClick={onBack}>
            ← Back
          </button>
        )}

        <p className="travel-label">Content-based travel picks</p>
        <h1 className="travel-title">
          <span className="travel-title-main">Black & White Chef</span>
          <span className="travel-title-sub"> fans,</span>
          <br />
          try this Korea trip.
        </h1>

        {age && (
          <p className="travel-meta">
            A {age}s {userPreferences.gender === "female" ? "female" : "male"}{" "}
            traveler course tailored for you.
          </p>
        )}

        <p className="travel-desc">
          We curated real travel and food routes to extend the emotion sparked
          by K-content.
        </p>
      </header>

      {/* 0. 추천 여행지 TOP 3 (백엔드에서 가져온 데이터) */}
      {destinations.length > 0 && (
        <section className="travel-section">
          <h2 className="section-title">Top 3 Recommended Destinations</h2>
          <p className="section-subtitle">
            Personalized travel spots based on your preferences.
          </p>

          <div className="card-row">
            {destinations.map((destination, idx) => (
              <article
                key={idx}
                className={`restaurant-card reveal delay-${(idx % 4) + 1}`}
                ref={(el) => revealRefs.current.push(el)}
              >
                <div className="restaurant-card-header">
                  <span className="restaurant-chip">RECOMMENDED</span>
                </div>

                <p className="restaurant-name">{destination.name}</p>
                <p className="restaurant-location">{destination.address}</p>
                {destination.description && (
                  <p className="restaurant-desc">{destination.description}</p>
                )}

                <button
                  className="restaurant-map-btn"
                  onClick={() => openGoogleMap(destination.name, destination.address)}
                >
                  🗺️ Open in Google Maps
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 1. 방송 속 맛집 TOP 5 */}
      <section className="travel-section">
        <h2 className="section-title">Top 5 restaurants from the show</h2>
        <p className="section-subtitle">
          Only the most talked-about spots that appeared on Black & White Chef.
        </p>

        <div className="card-row">
          {topRestaurants.map((item, idx) => (
            <article
              key={item.id}
              className={`restaurant-card reveal delay-${(idx % 4) + 1}`}
              ref={(el) => revealRefs.current.push(el)}
            >
              <div className="restaurant-thumb">
                <img
                  src={`https://picsum.photos/seed/${item.id}/500/320`}
                  alt={item.restaurant}
                />
              </div>

              <div className="restaurant-card-header">
                <span className="restaurant-chip">TOP PICK</span>
                <span className="restaurant-chef">Chef {item.chef}</span>
              </div>

              <p className="restaurant-name">{item.restaurant}</p>
              <p className="restaurant-location">{getAddress(item)}</p>

              <button
                className="restaurant-map-btn"
                onClick={() => openGoogleMap(item.restaurant, getAddress(item))}
              >
                🗺️ Open in Google Maps
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* 2. 우리가 추천하는 코스 맛집 5곳 */}
      <section className="travel-section">
        <h2 className="section-title">5 restaurants perfect for a course</h2>
        <p className="section-subtitle">
          Chosen so you can visit multiple spots in one route.
        </p>

        <div className="card-row">
          {ourPickRestaurants.map((item, idx) => (
            <article
              key={item.id}
              className={`restaurant-card reveal delay-${(idx % 4) + 1}`}
              ref={(el) => revealRefs.current.push(el)}
            >
              <div className="restaurant-thumb">
                <img
                  src={`https://picsum.photos/seed/${item.id}/500/320`}
                  alt={item.restaurant}
                />
              </div>

              <div className="restaurant-card-header">
                <span className="restaurant-chip">COURSE PICK</span>
                <span className="restaurant-chef">Chef {item.chef}</span>
              </div>

              <p className="restaurant-name">{item.restaurant}</p>
              <p className="restaurant-location">{getAddress(item)}</p>

              <button
                className="restaurant-map-btn"
                onClick={() => openGoogleMap(item.restaurant, getAddress(item))}
              >
                🗺️ Open in Google Maps
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* 3. 주변에서 함께 가기 좋은 근처 맛집 5곳 */}
      <section className="travel-section">
        <h2 className="section-title">5 nearby stops to drop by</h2>
        <p className="section-subtitle">
          Easy stops near your route to slip in between activities.
        </p>

        <div className="card-row">
          {nearbyRestaurants.map((item, idx) => (
            <article
              key={item.id}
              className={`restaurant-card reveal delay-${(idx % 4) + 1}`}
              ref={(el) => revealRefs.current.push(el)}
            >
              <div className="restaurant-thumb">
                <img
                  src={`https://picsum.photos/seed/${item.id}/500/320`}
                  alt={item.restaurant}
                />
              </div>

              <div className="restaurant-card-header">
                <span className="restaurant-chip">NEARBY</span>
                <span className="restaurant-chef">Chef {item.chef}</span>
              </div>

              <p className="restaurant-name">{item.restaurant}</p>
              <p className="restaurant-location">{getAddress(item)}</p>

              <button
                className="restaurant-map-btn"
                onClick={() => openGoogleMap(item.restaurant, getAddress(item))}
              >
                🗺️ Open in Google Maps
              </button>
            </article>
          ))}
        </div>
      </section>
      {/* 4. Team Picks – Chat Style Reviews */}
      <section
        className="team-review-section reveal"
        ref={(el) => revealRefs.current.push(el)}
      >
        <h2 className="section-title center">Team Picks 💬</h2>
        <p className="section-subtitle center">
          Restaurants our team personally recommends.
        </p>

        <div className="chat-list">
          {/* LEFT */}
          <div className="chat-item left">
            <img
              src="/images/avatar.jpeg"
              alt="team member"
              className="chat-avatar"
            />
            <div className="chat-bubble">
              <h4>🍜 프론트엔드 개발자 추천</h4>
              <p>
                "화면 너머의 감동이 현실로 전이되는 순간" <br /> "드라마 속
                주인공이 눈물을 흘리던 그 자리에 앉아보니, 단순히 예쁜 장소를
                넘어선 서사가 느껴졌어요. 특히 이곳은 조명 설계가 극 중 분위기와
                완벽하게 일치해서, 오후 4시쯤 방문하면 화면 속 그 필터가 그대로
                입혀진 듯한 묘한 기분을 느낄 수 있습니다. 혼자 여행하시는
                분들이라면 구석 창가 자리를 추천해요. 이어폰으로 드라마 OST를
                들으며 김밥을 먹는 것만으로도 완벽한 '과몰입' 여행이 완성될
                거예요."
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="chat-item right">
            <div className="chat-bubble">
              <h4>🍷 디자이너 Pick</h4>
              <p>
                "렌즈에 담기는 모든 각도가 예술인 공간" <br />
                "직업병일지 모르겠지만, 공간의 컬러 팔레트와 가구 배치를 먼저
                보게 되더라고요. 이곳은 현대적인 미니멀리즘과 드라마 특유의
                차가운 톤이 정말 세련되게 믹스되어 있습니다. 특히 통창으로
                들어오는 자연광이 내부의 노출 콘크리트 벽에 닿을 때의 그 질감은
                사진으로 다 담기지 않을 정도예요. SNS에 올릴 '인생샷'을
                원하신다면 블루 아워(일몰 직후)에 맞춰 가보세요. 보정 없이도
                화보 같은 결과물을 얻으실 겁니다."
              </p>
            </div>
            <img
              src="/images/avatar.jpeg"
              alt="team member"
              className="chat-avatar"
            />
          </div>

          {/* LEFT */}
          <div className="chat-item left">
            <img
              src="/images/avatar2.jpeg"
              alt="team member"
              className="chat-avatar"
            />
            <div className="chat-bubble">
              <h4>🔥 백엔드 개발자 추천</h4>
              <p>
                "동선 최적화와 만족도, 두 마리 토끼를 잡는 전략적 선택" <br />
                "여행에서 가장 중요한 건 '시간 대비 경험의 밀도'라고 생각합니다.
                이 촬영지는 지하철역에서 도보 5분 거리라는 압도적인 접근성을
                가지고 있고, 여기서 시작해 근처 유명 카페와 소품샵까지 이어지는
                동선이 매우 깔끔해요. 주변 맛집 데이터와 비교해 봐도 리뷰 평점이
                꾸준히 높은 곳이라 실패 확률이 낮습니다. 효율적인 K-콘텐츠
                투어를 계획 중인 외국인 친구에게 제가 가장 먼저 추천해주는
                '검증된' 루트입니다."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Time Slip Button */}
      {onOpenTimeSlip && (
        <button
          onClick={onOpenTimeSlip}
          className="floating-timeslip-btn"
          aria-label="Open Time Slip"
        >
          <div className="floating-btn-character">
            <div className="character-body">
              <div className="character-head">
                <div className="character-eyes">
                  <span className="eye">•</span>
                  <span className="eye">•</span>
                </div>
                <div className="character-smile">⌣</div>
              </div>
              <div className="character-camera">📸</div>
            </div>
          </div>
          <span className="floating-btn-text">Time Slip!</span>
        </button>
      )}
    </section>
  );
}
