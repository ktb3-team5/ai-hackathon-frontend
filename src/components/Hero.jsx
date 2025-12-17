import "../styles/Hero.css";

export default function Hero({ isPersonalized, userPreferences }) {
  const getHeadlineContent = () => {
    if (isPersonalized && userPreferences) {
      const age =
        new Date().getFullYear() - parseInt(userPreferences.birthYear);
      const genderText = userPreferences.gender === "female" ? "여성" : "남성";
      return {
        main: `${age}대 ${genderText}을 위한`,
        sub: "맞춤형 K-콘텐츠 여행지",
        desc: "당신의 취향에 딱 맞는 한국 여행지를 추천해드려요",
      };
    }
    return {
      main: "Discover Korea Through Content",
      sub: "AI-Powered Travel Recommendations",
      desc: "Based on K-Content You Love.",
    };
  };

  const content = getHeadlineContent();

  return (
    <section className="hero">
      <h1 className="logoWord">K-MEDIA</h1>

      <div className="heroRight">
        <h2 className="headline">
          {content.main}
          <br />
          {content.sub}{" "}
          {!isPersonalized && <span className="ghost">Recommendations</span>}
          <br />
          {content.desc}
        </h2>

        {/* <button className="cta">
          <span className="avatar" />
          <span className="ctaText">SIGN UP NOW</span>
        </button> */}
      </div>
    </section>
  );
}
