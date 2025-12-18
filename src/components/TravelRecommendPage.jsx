import { useEffect, useRef, useState } from "react";
import "../styles/TravelRecommendPage.css";
import { RESTAURANT_DATA } from "../data/restaurants";
import { api } from "../services/api";

export default function TravelRecommendPage({ userPreferences, selectedMediaId, selectedMediaTitle, onBack, onOpenTimeSlip }) {
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

  const [likedIds, setLikedIds] = useState(() => []); // 배열로 변경하여 순서 유지
  const [visibleIds, setVisibleIds] = useState(() => new Set());
  const [isReordering, setIsReordering] = useState(false);

  const [activeCardId, setActiveCardId] = useState(null);

  const teamReviewRef = useRef(null);
  const cardRefs = useRef({});

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
        console.log('🖼️ [TravelRecommendPage] Destinations data:', data);
        data.forEach((dest, idx) => {
          console.log(`🖼️ [${idx}] Name: ${dest.name}, ImageURL: ${dest.imageUrl}`);
        });
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
    // FLIP: First - 현재 위치 저장
    const cardElements = document.querySelectorAll('.restaurant-card');
    const positions = new Map();
    cardElements.forEach(el => {
      const cardId = el.getAttribute('data-card-id');
      if (cardId) {
        positions.set(cardId, el.getBoundingClientRect());
      }
    });

    setLikedIds((prev) => {
      const index = prev.indexOf(id);
      if (index > -1) {
        // 좋아요 취소: 배열에서 제거
        return prev.filter(likedId => likedId !== id);
      } else {
        // 좋아요 추가: 배열 맨 앞에 추가
        return [id, ...prev];
      }
    });

    // FLIP: Last, Invert, Play
    requestAnimationFrame(() => {
      cardElements.forEach(el => {
        const cardId = el.getAttribute('data-card-id');
        if (cardId && positions.has(cardId)) {
          const oldPos = positions.get(cardId);
          const newPos = el.getBoundingClientRect();

          const deltaX = oldPos.left - newPos.left;
          const deltaY = oldPos.top - newPos.top;

          if (deltaX !== 0 || deltaY !== 0) {
            // Invert
            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            el.style.transition = 'none';

            // Play
            requestAnimationFrame(() => {
              el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
              el.style.transform = 'translate(0, 0)';
            });
          }
        }
      });
    });
  };

  const isLiked = (id) => likedIds.includes(id);
  const isVisible = (id) => visibleIds.has(id);

  const sortByLiked = (list) => {
    // 좋아요하지 않은 카드들 (원래 순서 유지)
    const notLiked = list.filter(item => !isLiked(item.id));

    // 좋아요한 카드들 (좋아요 누른 순서대로)
    const liked = likedIds
      .map(likedId => list.find(item => item.id === likedId))
      .filter(Boolean); // undefined 제거

    // 좋아요한 카드들을 앞에, 나머지는 원래 순서로
    return [...liked, ...notLiked];
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
          <span className="travel-title-main">{selectedMediaTitle || 'K-Content'}</span>
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
                className="restaurant-card"
              >
                <div className="restaurant-thumb">
                  <img
                    src={destination.imageUrl || '/api/images/destinations/주문진영진해변방사제.png'}
                    alt={destination.name}
                    onLoad={() => console.log('✅ Image loaded:', destination.imageUrl)}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', destination.imageUrl);
                      e.target.src = '/api/images/destinations/주문진영진해변방사제.png'; // fallback
                    }}
                  />
                </div>

                <div className="restaurant-card-body">
                  <div className="restaurant-card-header">
                    <span className="restaurant-chip">RECOMMENDED</span>
                  </div>

                  <p className="restaurant-name">{destination.name}</p>
                  <p className="restaurant-location">{destination.address}</p>
                  {destination.description && (
                    <p className="restaurant-desc">{destination.description}</p>
                  )}
                </div>
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
                data-card-id={`top-${item.id}`}
                className={`restaurant-card reveal delay-${(idx % 4) + 1}${
                  isVisible(`top-${item.id}`) ? " is-visible" : ""
                }${isLiked(item.id) ? " is-liked-card" : ""}`}
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
                      e.stopPropagation();
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
                        drama. Strolling through its grounds, you'll feel
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
                data-card-id={`our-${item.id}`}
                className={`restaurant-card reveal delay-${(idx % 4) + 1}${
                  isVisible(`our-${item.id}`) ? " is-visible" : ""
                }${isLiked(item.id) ? " is-liked-card" : ""}`}
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
                data-card-id={`near-${item.id}`}
                className={`restaurant-card reveal delay-${(idx % 4) + 1}${
                  isVisible(`near-${item.id}`) ? " is-visible" : ""
                }${isLiked(item.id) ? " is-liked-card" : ""}`}
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
              <h4>🍜 Frontend Developer's Pick</h4>
              <p>
                "When screen emotions become reality" <br /> "Sitting in the exact spot where the drama's protagonist shed tears, I felt a narrative that went beyond just a pretty location. The lighting design here perfectly matches the show's atmosphere—visit around 4 PM and you'll experience that same cinematic filter in real life. For solo travelers, I recommend the corner window seat. Just eating kimbap while listening to the drama's OST through your earphones creates the perfect 'immersive' travel experience."
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="chat-item right">
            <div className="chat-bubble">
              <h4>🍷 Designer's Pick</h4>
              <p>
                "A space where every angle is art" <br />
                "Call it occupational hazard, but I immediately noticed the color palette and furniture arrangement. This place elegantly blends modern minimalism with the drama's signature cool tones. The texture when natural light through the floor-to-ceiling windows hits the exposed concrete walls is beyond what photos can capture. If you want that perfect Instagram shot, visit during blue hour (right after sunset). You'll get magazine-quality results without any filters."
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
              <h4>🔥 Backend Developer's Pick</h4>
              <p>
                "Strategic choice for optimized routing and maximum satisfaction" <br />
                "I believe the most important thing in travel is 'experience density per time spent'. This filming location has overwhelming accessibility—just 5 minutes walk from the subway station. The route connecting nearby famous cafes and shops is perfectly optimized. Comparing with surrounding restaurant data, this place consistently maintains high review ratings, so failure rate is low. This is the 'verified' route I recommend first to my international friends planning an efficient K-content tour."
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
          <svg className="timeslip-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span className="floating-btn-text">Time Slip</span>
        </button>
      )}
    </section>
  );
}
