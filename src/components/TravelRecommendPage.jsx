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

  const [likedIds, setLikedIds] = useState(() => new Set());
  const [visibleIds, setVisibleIds] = useState(() => new Set());

  const [activeCardId, setActiveCardId] = useState(null);

  const teamReviewRef = useRef(null);

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
  }, []);

  useEffect(() => {
    const markVisible = (id) => {
      setVisibleIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.revealId;
            if (id) markVisible(id);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document
      .querySelectorAll("[data-reveal-id]")
      .forEach((el) => observer.observe(el));

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

  const scrollToTeamReviews = () => {
    teamReviewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /** 주소 안전 추출 */
  const getAddress = (item) =>
    item.locations ? item.locations[0].address : item.location;

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isLiked = (id) => likedIds.has(id);
  const isVisible = (id) => visibleIds.has(id);

  const sortByLiked = (list) => {
    const liked = [];
    const rest = [];
    list.forEach((item) => {
      if (isLiked(item.id)) {
        liked.push(item);
      } else {
        rest.push(item);
      }
    });
    return [...liked, ...rest];
  };

  return (
    <section className="travel-page">
      <header
        className={`travel-header reveal${
          isVisible("header") ? " is-visible" : ""
        }`}
        data-reveal-id="header"
      >
        {onBack && (
          <button className="travel-back-btn" onClick={onBack}>
            <img
              src="/images/back.png"
              alt="Back"
              className="travel-back-icon"
            />
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

        <div className="team-review-cta-wrapper">
          <button className="team-review-cta-btn" onClick={scrollToTeamReviews}>
            💬 See Team Picks
          </button>
        </div>
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

        <div className="card-row-wrap">
          <div className="card-row">
            {sortByLiked(topRestaurants).map((item, idx) => (
              <article
                key={item.id}
                className={`restaurant-card reveal delay-${(idx % 4) + 1}${
                  isVisible(`top-${item.id}`) ? " is-visible" : ""
                }`}
                data-reveal-id={`top-${item.id}`}
                onClick={() => setActiveCardId(item.id)}
              >
                <div className="restaurant-thumb">
                  <img
                    src={`https://picsum.photos/seed/${item.id}/500/320`}
                    alt={item.restaurant}
                  />
                  <span className="restaurant-chip on-thumb">TOP PICK</span>
                  <button
                    type="button"
                    className={`like-btn${isLiked(item.id) ? " is-liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 핵심
                      toggleLike(item.id);
                    }}
                    aria-pressed={isLiked(item.id)}
                    aria-label={
                      isLiked(item.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <img
                      key={isLiked(item.id) ? "liked" : "unliked"}
                      className="like-icon"
                      src={
                        isLiked(item.id)
                          ? "/images/heart_on.svg"
                          : "/images/heart.svg"
                      }
                      alt=""
                      aria-hidden="true"
                    />
                  </button>

                  {/* 🔥 인카드 미니 모달 */}
                  {activeCardId === item.id && (
                    <div
                      className="card-overlay-modal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="card-overlay-close"
                        onClick={() => setActiveCardId(null)}
                        aria-label="Close"
                      >
                        <img
                          src="/images/cancel.png"
                          alt=""
                          aria-hidden="true"
                        />
                      </button>

                      <h4 className="card-overlay-title">{item.restaurant}</h4>
                      <p className="card-overlay-desc">
                        Visiting 경복궁 immerses you in the enchanting world of
                        해를 품은 달, where the elegant architecture and serene
                        gardens evoke the romance and intrigue of historical
                        drama. Strolling through its grounds, you’ll feel
                        connected to the poignant emotions of the characters.
                      </p>
                    </div>
                  )}
                </div>

                <div className="restaurant-card-header">
                  <span className="restaurant-chef">Chef {item.chef}</span>
                </div>

                <p className="restaurant-name">{item.restaurant}</p>
                <p className="restaurant-location">{getAddress(item)}</p>

                <div className="restaurant-map-actions">
                  <button
                    className="restaurant-map-btn"
                    onClick={() =>
                      openGoogleMap(item.restaurant, getAddress(item))
                    }
                  >
                    🗺️ Google Maps
                  </button>
                  <button
                    className="restaurant-map-btn"
                    onClick={() =>
                      openGoogleMap(item.restaurant, getAddress(item))
                    } // 여기에 백엔드에서 받아온 구글 뷰 링크 넣어야됌.
                  >
                    🗺️ Google Map Views
                  </button>
                </div>
              </article>
            ))}
          </div>
          <img
            className="card-row-arrow"
            src="/images/next.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>

      {/* 2. 우리가 추천하는 코스 맛집 5곳 */}
      <section className="travel-section">
        <h2 className="section-title">5 restaurants perfect for a course</h2>
        <p className="section-subtitle">
          Chosen so you can visit multiple spots in one route.
        </p>

        <div className="card-row-wrap">
          <div className="card-row">
            {sortByLiked(ourPickRestaurants).map((item, idx) => (
              <article
                key={item.id}
                className={`restaurant-card reveal delay-${(idx % 4) + 1}${
                  isVisible(`our-${item.id}`) ? " is-visible" : ""
                }`}
                data-reveal-id={`our-${item.id}`}
              >
                <div className="restaurant-thumb">
                  <img
                    src={`https://picsum.photos/seed/${item.id}/500/320`}
                    alt={item.restaurant}
                  />
                  <span className="restaurant-chip on-thumb">COURSE PICK</span>
                  <button
                    type="button"
                    className={`like-btn${isLiked(item.id) ? " is-liked" : ""}`}
                    onClick={() => toggleLike(item.id)}
                    aria-pressed={isLiked(item.id)}
                    aria-label={
                      isLiked(item.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <img
                      key={isLiked(item.id) ? "liked" : "unliked"}
                      className="like-icon"
                      src={
                        isLiked(item.id)
                          ? "/images/heart_on.svg"
                          : "/images/heart.svg"
                      }
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="restaurant-card-header">
                  <span className="restaurant-chef">Chef {item.chef}</span>
                </div>

                <p className="restaurant-name">{item.restaurant}</p>
                <p className="restaurant-location">{getAddress(item)}</p>

                <div className="restaurant-map-actions">
                  <button
                    className="restaurant-map-btn"
                    onClick={() =>
                      openGoogleMap(item.restaurant, getAddress(item))
                    }
                  >
                    🗺️ Google Maps
                  </button>
                  <button
                    className="restaurant-map-btn"
                    onClick={() =>
                      openGoogleMap(item.restaurant, getAddress(item))
                    } // 여기에 백엔드에서 받아온 구글 뷰 링크 넣어야됌.
                  >
                    🗺️ Google Map Views
                  </button>
                </div>
              </article>
            ))}
          </div>
          <img
            className="card-row-arrow"
            src="/images/next.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>

      {/* 3. 주변에서 함께 가기 좋은 근처 맛집 5곳 */}
      <section className="travel-section">
        <h2 className="section-title">5 nearby stops to drop by</h2>
        <p className="section-subtitle">
          Easy stops near your route to slip in between activities.
        </p>

        <div className="card-row-wrap">
          <div className="card-row">
            {sortByLiked(nearbyRestaurants).map((item, idx) => (
              <article
                key={item.id}
                className={`restaurant-card reveal delay-${(idx % 4) + 1}${
                  isVisible(`near-${item.id}`) ? " is-visible" : ""
                }`}
                data-reveal-id={`near-${item.id}`}
              >
                <div className="restaurant-thumb">
                  <img
                    src={`https://picsum.photos/seed/${item.id}/500/320`}
                    alt={item.restaurant}
                  />
                  <span className="restaurant-chip on-thumb">NEARBY</span>
                  <button
                    type="button"
                    className={`like-btn${isLiked(item.id) ? " is-liked" : ""}`}
                    onClick={() => toggleLike(item.id)}
                    aria-pressed={isLiked(item.id)}
                    aria-label={
                      isLiked(item.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <img
                      key={isLiked(item.id) ? "liked" : "unliked"}
                      className="like-icon"
                      src={
                        isLiked(item.id)
                          ? "/images/heart_on.svg"
                          : "/images/heart.svg"
                      }
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="restaurant-card-header">
                  <span className="restaurant-chef">Chef {item.chef}</span>
                </div>

                <p className="restaurant-name">{item.restaurant}</p>
                <p className="restaurant-location">{getAddress(item)}</p>

                <div className="restaurant-map-actions">
                  <button
                    className="restaurant-map-btn"
                    onClick={() =>
                      openGoogleMap(item.restaurant, getAddress(item))
                    }
                  >
                    🗺️ Google Maps
                  </button>
                  <button
                    className="restaurant-map-btn"
                    onClick={() =>
                      openGoogleMap(item.restaurant, getAddress(item))
                    } // 여기에 백엔드에서 받아온 구글 뷰 링크 넣어야됌.
                  >
                    🗺️ Google Map Views
                  </button>
                </div>
              </article>
            ))}
          </div>
          <img
            className="card-row-arrow"
            src="/images/next.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>
      {/* 4. Team Picks – Chat Style Reviews */}
      <section
        className={`team-review-section reveal${
          isVisible("team-review") ? " is-visible" : ""
        }`}
        data-reveal-id="team-review"
        ref={teamReviewRef}
      >
        <h2 className="section-title center">Team Picks 💬</h2>
        <p className="section-subtitle center">
          Restaurants our team personally recommends.
        </p>

        <div className="chat-list">
          {/* LEFT */}
          <div className="chat-item left">
            <img
              src="/images/avatar3.jpeg"
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
              src="/images/avatar4.jpeg"
              alt="team member"
              className="chat-avatar"
            />
          </div>

          {/* LEFT */}
          <div className="chat-item left">
            <img
              src="/images/avatar5.jpeg"
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
