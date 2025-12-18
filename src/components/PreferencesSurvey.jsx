import { useState } from "react";
import "../styles/PreferencesSurvey.css";
import KoreanCarousel from "./KoreanCarousel";
import { api } from "../services/api";

const GENRES = [
  { id: "drama", label: "Drama", emoji: "🎭" },
  { id: "variety", label: "Variety Show", emoji: "🎪" },
  { id: "movie", label: "Movie", emoji: "🎬" },
  { id: "music", label: "Music/Live", emoji: "🎵" },
  { id: "vlog", label: "Vlog", emoji: "📹" },
  { id: "food", label: "Food Show", emoji: "🍜" },
];

const TRAVEL_STYLES = [
  {
    id: "healing",
    label: "Healing trip",
    emoji: "🌿",
    desc: "Calm and easygoing",
  },
  {
    id: "activity",
    label: "Activities",
    emoji: "🏃",
    desc: "Active and energetic",
  },
  {
    id: "hotplace",
    label: "Trendy spots",
    emoji: "📸",
    desc: "Visiting hot spots",
  },
  {
    id: "food",
    label: "Foodie tour",
    emoji: "🍽️",
    desc: "Centered on food hunts",
  },
  {
    id: "culture",
    label: "Cultural experience",
    emoji: "🏛️",
    desc: "History and tradition",
  },
  {
    id: "nature",
    label: "Nature escape",
    emoji: "🏔️",
    desc: "Mountains, sea, outdoors",
  },
];

const AGE_RANGES = ["Teens", "20s", "30s", "40s", "50s", "Other"];

export default function PreferencesSurvey({ onComplete }) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    participated: null,
    ageRange: "",
    gender: "",
    genres: [],
    travelStyles: [],
    selectedContent: null,
    skipContentSelection: false,
  });

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // 설문 완료 시 백엔드에 데이터 전송
      try {
        // 1. 사용자 생성
        await api.createUser();

        // 2. 사용자 태그(선호도) 생성
        const tags = {
          gender: preferences.gender,
          ageGroup: preferences.ageRange,
          genre: preferences.genres.join(','), // 배열을 쉼표로 구분된 문자열로 변환
          travelStyle: preferences.travelStyles.join(','),
        };
        await api.createUserTags(tags);

        onComplete(preferences);
      } catch (error) {
        console.error('Failed to save preferences:', error);
        // 에러가 발생해도 사용자 경험을 위해 계속 진행
        onComplete(preferences);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return preferences.gender && preferences.ageRange;
      case 2:
        return preferences.genres.length > 0;
      case 3:
        return preferences.travelStyles.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="survey-overlay">
      <div className="survey-container">
        {step > 0 && (
          <div className="survey-header">
            <span className="survey-badge">Spot On</span>
            <div className="survey-progress">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`progress-dot ${s <= step ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 0 */}
        {step === 0 && (
          <div className="survey-content welcome-step">
            <h2 className="survey-title welcome-title">
              Want tailor-made
              <br />
              Korea trip ideas
              <br />
              just for you?
            </h2>
            <p className="survey-subtitle">
              A quick taste check to match you with the perfect Korean trip.
              <br />
              Takes about a minute!
            </p>

            <div className="welcome-options">
              <button
                className="welcome-btn participate"
                onClick={() => {
                  setPreferences({ ...preferences, participated: true });
                  setStep(1);
                }}
              >
                <div className="welcome-icon">✨</div>
                <div>
                  <div className="welcome-label">Yes, let's do it!</div>
                  <div className="welcome-desc">I want a personal pick</div>
                </div>
              </button>

              <button
                className="welcome-btn skip"
                onClick={() =>
                  onComplete({ ...preferences, participated: false })
                }
              >
                <div className="welcome-icon">👋</div>
                <div>
                  <div className="welcome-label">Maybe later</div>
                  <div className="welcome-desc">Show me popular picks</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1 – Gender + Age Range */}
        {step === 1 && (
          <div className="survey-content step-one">
            <h2 className="survey-title">Please select your gender and age range.</h2>
            <p className="survey-subtitle">
              We'll recommend personalized travel destinations
              <br />
              based on your selection.
            </p>

            <div className="gender-options">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  className={`gender-btn ${
                    preferences.gender === g ? "selected" : ""
                  }`}
                  onClick={() => setPreferences({ ...preferences, gender: g })}
                >
                  <div className="gender-icon">
                    {g === "male" ? "👨" : "👩"}
                  </div>
                  <span>{g === "male" ? "Male" : "Female"}</span>
                </button>
              ))}
            </div>

            <div className="age-grid">
              {AGE_RANGES.map((age) => (
                <button
                  key={age}
                  className={`age-btn ${
                    preferences.ageRange === age ? "selected" : ""
                  }`}
                  onClick={() =>
                    setPreferences({ ...preferences, ageRange: age })
                  }
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="survey-content">
            <h2 className="survey-title">Which K-content do you enjoy?</h2>
            <p className="survey-subtitle">Choose your favorite genres.</p>

            <div className="survey-options genre-grid">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  className={`genre-btn ${
                    preferences.genres.includes(genre.id) ? "selected" : ""
                  }`}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      genres: preferences.genres.includes(genre.id)
                        ? preferences.genres.filter((g) => g !== genre.id)
                        : [...preferences.genres, genre.id],
                    })
                  }
                >
                  <div className="genre-emoji">{genre.emoji}</div>
                  <span>{genre.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="survey-content">
            <h2 className="survey-title">What's your travel style?</h2>
            <p className="survey-subtitle">Choose as many as you like.</p>

            <div className="survey-options travel-grid">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.id}
                  className={`travel-btn ${
                    preferences.travelStyles.includes(style.id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      travelStyles: preferences.travelStyles.includes(style.id)
                        ? preferences.travelStyles.filter((s) => s !== style.id)
                        : [...preferences.travelStyles, style.id],
                    })
                  }
                >
                  <div className="travel-emoji">{style.emoji}</div>
                  <div>
                    <div className="travel-label">{style.label}</div>
                    <div className="travel-desc">{style.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ❌ STEP 4 – 임시 주석 처리
        {step === 4 && (
          <div className="survey-content">
            ...
          </div>
        )}
        */}

        {step > 0 && (
          <div className="survey-footer">
            {step > 1 && (
              <button className="survey-btn-back" onClick={handleBack}>
                Back
              </button>
            )}
            <button
              className="survey-btn-next"
              disabled={!canProceed()}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
