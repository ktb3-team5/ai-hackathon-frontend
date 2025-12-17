import { useState } from "react";
import "./App.css";
import TopNav from "./components/TopNav";
import Hero from "./components/Hero";
import Canvas from "./components/Canvas";
import KoreanCarousel from "./components/KoreanCarousel";
import PreferencesSurvey from "./components/PreferencesSurvey";

export default function App() {
  const [showSurvey, setShowSurvey] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);

  const handleSurveyComplete = (preferences) => {
    setUserPreferences(preferences);
    setShowSurvey(false);
  };

  if (showSurvey) {
    return <PreferencesSurvey onComplete={handleSurveyComplete} />;
  }

  // 참여 여부에 따라 다른 컨텐츠 표시
  const isPersonalized = userPreferences?.participated === true;

  return (
    <div>
      <TopNav />
      <Hero isPersonalized={isPersonalized} userPreferences={userPreferences} />
      <Canvas />
      <KoreanCarousel isPersonalized={isPersonalized} userPreferences={userPreferences} />
    </div>
  );
}
