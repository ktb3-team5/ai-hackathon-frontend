import { useState } from "react";
import "../styles/PreferencesSurvey.css";

const BIRTH_YEARS = Array.from({ length: 60 }, (_, i) => 2010 - i);

const GENRES = [
  { id: "drama", label: "드라마", emoji: "🎭" },
  { id: "variety", label: "예능", emoji: "🎪" },
  { id: "movie", label: "영화", emoji: "🎬" },
  { id: "music", label: "음악/공연", emoji: "🎵" },
  { id: "vlog", label: "브이로그", emoji: "📹" },
  { id: "food", label: "먹방", emoji: "🍜" },
];

const TRAVEL_STYLES = [
  { id: "healing", label: "힐링 여행", emoji: "🌿", desc: "조용하고 여유로운" },
  { id: "activity", label: "액티비티", emoji: "🏃", desc: "활동적이고 역동적인" },
  { id: "food", label: "맛집 투어", emoji: "🍽️", desc: "미식 탐방 중심" },
  { id: "culture", label: "문화 체험", emoji: "🏛️", desc: "역사와 전통 탐방" },
  { id: "hotplace", label: "핫플 투어", emoji: "📸", desc: "트렌디한 명소 방문" },
  { id: "nature", label: "자연 탐방", emoji: "🏔️", desc: "산과 바다, 자연 속" },
];

export default function PreferencesSurvey({ onComplete }) {
  const [step, setStep] = useState(0); // 0: 참여 여부 선택, 1~4: 설문 단계
  const [preferences, setPreferences] = useState({
    participated: null, // true: 참여, false: 건너뛰기
    birthYear: "",
    gender: "",
    genres: [],
    travelStyles: [],
  });

  const handleBirthYearSelect = (year) => {
    setPreferences({ ...preferences, birthYear: year });
  };

  const handleGenderSelect = (gender) => {
    setPreferences({ ...preferences, gender });
  };

  const handleGenreToggle = (genreId) => {
    const newGenres = preferences.genres.includes(genreId)
      ? preferences.genres.filter((id) => id !== genreId)
      : [...preferences.genres, genreId];
    setPreferences({ ...preferences, genres: newGenres });
  };

  const handleTravelStyleToggle = (styleId) => {
    const newStyles = preferences.travelStyles.includes(styleId)
      ? preferences.travelStyles.filter((id) => id !== styleId)
      : [...preferences.travelStyles, styleId];
    setPreferences({ ...preferences, travelStyles: newStyles });
  };

  const handleParticipate = () => {
    setPreferences({ ...preferences, participated: true });
    setStep(1);
  };

  const handleSkip = () => {
    onComplete({ ...preferences, participated: false });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return preferences.birthYear !== "" && preferences.gender !== "";
      case 2:
        return preferences.genres.length > 0;
      case 3:
        return preferences.travelStyles.length > 0;
      case 4:
        return preferences.region !== undefined && preferences.region !== "";
      default:
        return false;
    }
  };

  return (
    <div className="survey-overlay">
      <div className="survey-container">
        {step > 0 && (
          <div className="survey-header">
            <span className="survey-badge">취향저격</span>
            <div className="survey-progress">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`progress-dot ${s <= step ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        )}

        {step === 0 && (
          <div className="survey-content welcome-step">
            <h2 className="survey-title welcome-title">
              나만을 위한
              <br />
              맞춤 여행지 추천을
              <br />
              받아보시겠어요?
            </h2>
            <p className="survey-subtitle">
              간단한 취향 설문을 통해 당신에게 딱 맞는 한국 여행지를 추천해드려요.
              <br />
              약 1분이면 완료됩니다!
            </p>

            <div className="welcome-options">
              <button className="welcome-btn participate" onClick={handleParticipate}>
                <div className="welcome-icon">✨</div>
                <div className="welcome-text">
                  <span className="welcome-label">네, 참여할게요!</span>
                  <span className="welcome-desc">나에게 딱 맞는 추천을 받고 싶어요</span>
                </div>
              </button>

              <button className="welcome-btn skip" onClick={handleSkip}>
                <div className="welcome-icon">👋</div>
                <div className="welcome-text">
                  <span className="welcome-label">다음에 할게요</span>
                  <span className="welcome-desc">일단 인기 콘텐츠부터 볼래요</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="survey-content">
            <h2 className="survey-title">
              나만을 위한 상품
              <br />
              추천을 위해
              <br />
              3초만 내어주세요!
            </h2>
            <p className="survey-subtitle">
              출생년도와 성별을 설정하면, 나와 비슷한 사람들이 많이 찾는 키워드와
              상품을 만나 볼 수 있어요.
            </p>

            <div className="survey-options">
              <div className="birth-year-select">
                <select
                  value={preferences.birthYear}
                  onChange={(e) => handleBirthYearSelect(e.target.value)}
                  className="birth-year-dropdown"
                >
                  <option value="">출생년도 선택</option>
                  {BIRTH_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="gender-options">
                <button
                  className={`gender-btn ${
                    preferences.gender === "female" ? "selected" : ""
                  }`}
                  onClick={() => handleGenderSelect("female")}
                >
                  <div className="gender-icon">👩</div>
                  <span>여성</span>
                  {preferences.gender === "female" && (
                    <span className="check-mark">✓</span>
                  )}
                </button>
                <button
                  className={`gender-btn ${
                    preferences.gender === "male" ? "selected" : ""
                  }`}
                  onClick={() => handleGenderSelect("male")}
                >
                  <div className="gender-icon">👨</div>
                  <span>남성</span>
                  {preferences.gender === "male" && (
                    <span className="check-mark">✓</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="survey-content">
            <h2 className="survey-title">
              어떤 K-콘텐츠를
              <br />
              즐겨보시나요?
            </h2>
            <p className="survey-subtitle">
              선호하는 장르를 선택하면 관련 여행지를 추천해드려요. (중복 선택
              가능)
            </p>

            <div className="survey-options genre-grid">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  className={`genre-btn ${
                    preferences.genres.includes(genre.id) ? "selected" : ""
                  }`}
                  onClick={() => handleGenreToggle(genre.id)}
                >
                  <div className="genre-emoji">{genre.emoji}</div>
                  <span>{genre.label}</span>
                  {preferences.genres.includes(genre.id) && (
                    <span className="check-mark">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="survey-content">
            <h2 className="survey-title">
              선호하는
              <br />
              여행 스타일은?
            </h2>
            <p className="survey-subtitle">
              여행 스타일에 맞는 장소를 추천해드려요. (중복 선택 가능)
            </p>

            <div className="survey-options travel-grid">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.id}
                  className={`travel-btn ${
                    preferences.travelStyles.includes(style.id) ? "selected" : ""
                  }`}
                  onClick={() => handleTravelStyleToggle(style.id)}
                >
                  <div className="travel-emoji">{style.emoji}</div>
                  <div className="travel-info">
                    <span className="travel-label">{style.label}</span>
                    <span className="travel-desc">{style.desc}</span>
                  </div>
                  {preferences.travelStyles.includes(style.id) && (
                    <span className="check-mark">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="survey-content">
            <h2 className="survey-title">
              마지막으로,
              <br />
              관심있는 지역은?
            </h2>
            <p className="survey-subtitle">
              선택한 지역의 콘텐츠와 여행지를 우선적으로 보여드려요.
            </p>

            <div className="survey-options region-grid">
              {[
                "서울",
                "경기",
                "강원",
                "충청",
                "전라",
                "경상",
                "제주",
              ].map((region) => (
                <button
                  key={region}
                  className={`region-btn ${
                    preferences.region === region ? "selected" : ""
                  }`}
                  onClick={() =>
                    setPreferences({ ...preferences, region })
                  }
                >
                  {region}
                  {preferences.region === region && (
                    <span className="check-mark">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step > 0 && (
          <div className="survey-footer">
            {step > 1 && (
              <button className="survey-btn-back" onClick={handleBack}>
                이전
              </button>
            )}
            <button
              className="survey-btn-next"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === 4 ? (
                <>
                  나에게 꼕 맞는 상품 보기
                  <span className="btn-icon">🔍</span>
                </>
              ) : (
                "다음"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
