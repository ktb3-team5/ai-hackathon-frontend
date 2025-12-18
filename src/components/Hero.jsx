import "../styles/Hero.css";

export default function Hero({ isPersonalized, userPreferences }) {
  const getHeadlineContent = () => {
    if (isPersonalized && userPreferences) {
      const age =
        new Date().getFullYear() - parseInt(userPreferences.birthYear);
      const genderText = userPreferences.gender === "female" ? "Female" : "Male";
      return {
        main: `For ${genderText} in ${age}s`,
        sub: "Tailored K-Content Travel",
        desc: "We recommend Korean travel destinations that perfectly match your taste",
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
