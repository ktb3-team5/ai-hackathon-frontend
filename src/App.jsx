import { useState } from "react";
import "./App.css";
import TopNav from "./components/TopNav";
import Hero from "./components/Hero";
import Canvas from "./components/Canvas";
import KoreanCarousel from "./components/KoreanCarousel";
import PreferencesSurvey from "./components/PreferencesSurvey";
import TravelRecommendPage from "./components/TravelRecommendPage";
import WorkationSection from "./components/WorkationSection";

export default function App() {
  const [showSurvey, setShowSurvey] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [showTravelPage, setShowTravelPage] = useState(false);

  const handleSurveyComplete = (preferences) => {
    setUserPreferences(preferences);
    setShowSurvey(false);
    if (preferences?.selectedContent) {
      setShowTravelPage(true);
    }
  };

  if (showSurvey) {
    return <PreferencesSurvey onComplete={handleSurveyComplete} />;
  }

  // 참여 여부에 따라 다른 컨텐츠 표시
  // const isPersonalized = userPreferences?.participated === true;

  if (showTravelPage) {
    return (
      <div>
        <TravelRecommendPage
          userPreferences={userPreferences}
          onBack={() => setShowTravelPage(false)}
        />
      </div>
    );
  }

  return (
    <div>
      {/* 설문 완료 후 기본 홈 화면 */}
      {/* <Hero isPersonalized={isPersonalized} userPreferences={userPreferences} />
      <Canvas />
      <KoreanCarousel
        isPersonalized={isPersonalized}
        userPreferences={userPreferences}
        onSelectContent={() => {
          setShowTravelPage(true);
        }} 
      />*/}
      <WorkationSection onSelectImage={() => setShowTravelPage(true)} />
    </div>
  );
}
