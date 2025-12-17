import { useState } from "react";
import "../styles/PreferencesSurvey.css";
import KoreanCarousel from "./KoreanCarousel";

const BIRTH_YEARS = Array.from({ length: 60 }, (_, i) => 2010 - i);

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

export default function PreferencesSurvey({ onComplete }) {
  const [step, setStep] = useState(0); // 0: participation choice, 1~4: survey steps (step 4 = pick from top 10)
  const [preferences, setPreferences] = useState({
    participated: null, // true: participate, false: skip
    birthYear: "",
    gender: "",
    genres: [],
    travelStyles: [],
    selectedContent: null,
    skipContentSelection: false,
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

  const handleSkipContentSelection = () => {
    const updated = {
      ...preferences,
      selectedContent: null,
      skipContentSelection: true,
    };
    setPreferences(updated);
    // If "none" is chosen on the last step, finish immediately
    onComplete(updated);
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
        // Can proceed when one of the top picks is chosen or the user skips
        return (
          preferences.selectedContent !== null ||
          preferences.skipContentSelection === true
        );
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
                onClick={handleParticipate}
              >
                <div className="welcome-icon">✨</div>
                <div className="welcome-text">
                  <span className="welcome-label">Yes, let's do it!</span>
                  <span className="welcome-desc">I want a personal pick</span>
                </div>
              </button>

              <button className="welcome-btn skip" onClick={handleSkip}>
                <div className="welcome-icon">👋</div>
                <div className="welcome-text">
                  <span className="welcome-label">Maybe later</span>
                  <span className="welcome-desc">Show me popular picks</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="survey-content">
            <h2 className="survey-title">
              For spot-on picks,
              <br />
              give us 3 seconds
              <br />
              to tune your profile!
            </h2>
            <p className="survey-subtitle">
              Set your birth year and gender to see what similar travelers love.
            </p>

            <div className="survey-options">
              <div className="birth-year-select">
                <select
                  value={preferences.birthYear}
                  onChange={(e) => handleBirthYearSelect(e.target.value)}
                  className="birth-year-dropdown"
                >
                  <option value="">Select birth year</option>
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
                  <span>Female</span>
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
                  <span>Male</span>
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
              Which K-content
              <br />
              do you enjoy?
            </h2>
            <p className="survey-subtitle">
              Choose your favorite genres (multiple selection welcome).
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
              What's your
              <br />
              travel style?
            </h2>
            <p className="survey-subtitle">
              We'll match spots to your style (choose as many as you like).
            </p>

            <div className="survey-options travel-grid">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.id}
                  className={`travel-btn ${
                    preferences.travelStyles.includes(style.id)
                      ? "selected"
                      : ""
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
              Lastly,
              <br />
              which K-content grabs you?
            </h2>
            <p className="survey-subtitle">
              Pick one to see travel ideas linked to it.
            </p>

            <div className="survey-carousel-wrapper">
              <KoreanCarousel
                isPersonalized={false}
                userPreferences={preferences}
                variant="survey"
                selectedContent={preferences.selectedContent}
                onSelectContent={(video) =>
                  setPreferences({
                    ...preferences,
                    selectedContent: video,
                    skipContentSelection: false,
                  })
                }
              />
            </div>

            <button
              type="button"
              className="survey-skip-content-btn"
              onClick={handleSkipContentSelection}
            >
              No interesting content right now
            </button>
          </div>
        )}

        {step > 0 && (
          <div className="survey-footer">
            {step > 1 && (
              <button className="survey-btn-back" onClick={handleBack}>
                Back
              </button>
            )}
            <button
              className="survey-btn-next"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === 4 ? (
                <>
                  See my tailored picks
                  <span className="btn-icon">🔍</span>
                </>
              ) : (
                "Next"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
