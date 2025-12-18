import "../styles/KoreanCarousel.css";

// Personalized Content (Route A - Survey Participants)
const PERSONALIZED_VIDEOS = [
  {
    id: 1,
    title: "Recommended Travel Spots for You",
    tag: "RECOMMEND",
    duration: "10:30",
    image: "/images/image.png",
  },
  {
    id: 2,
    title: "Healing Spots Tailored to Your Taste",
    tag: "HEALING",
    duration: "08:45",
    image: "/images/image2.png",
  },
  {
    id: 3,
    title: "Customized Activity Experiences",
    tag: "ACTIVITY",
    duration: "12:20",
    image: "/images/image3.png",
  },
  {
    id: 4,
    title: "Recommended Restaurant Tour",
    tag: "FOOD",
    duration: "15:10",
    image: "/images/image4.png",
  },
  {
    id: 5,
    title: "Cultural Experience Hotspots",
    tag: "CULTURE",
    duration: "09:50",
    image: "/images/image5.png",
  },
];

// Popular Content (Route B - Survey Skip & Survey Final TOP10)
const POPULAR_VIDEOS = [
  {
    id: 1,
    title: "Black & White Chef",
    tag: "TOP 1",
    image: "/images/top1.png",
  },
  {
    id: 2,
    title: "The Master of Confession",
    tag: "TOP 2",
    duration: "08:20",
    image: "/images/top2.png",
  },
  {
    id: 3,
    title: "Pro Bono",
    tag: "TOP 3",
    duration: "03:45",
    image: "/images/top3.png",
  },
  {
    id: 4,
    title: "Bad Romance",
    tag: "TOP 4",
    duration: "15:02",
    image: "/images/top4.png",
  },
  {
    id: 5,
    title: "Taxi Driver 3",
    tag: "TOP 5",
    duration: "06:18",
    image: "/images/top5.png",
  },
  {
    id: 6,
    title: "No Gain No Love",
    tag: "TOP 6",
    duration: "07:12",
    image: "/images/top6.png",
  },
  {
    id: 7,
    title: "Three Meals in Kenya",
    tag: "TOP 7",
    duration: "05:55",
    image: "/images/top7.png",
  },
  {
    id: 8,
    title: "Love Your Enemy",
    tag: "TOP 8",
    duration: "09:40",
    image: "/images/top8.png",
  },
  {
    id: 9,
    title: "K-Pop Demon Hunters",
    tag: "TOP 9",
    duration: "04:28",
    image: "/images/top9.png",
  },
  {
    id: 10,
    title: "Omniscient Reader",
    tag: "TOP 10",
    duration: "06:05",
    image: "/images/top10.png",
  },
];

export default function KoreanCarousel({
  isPersonalized,
  userPreferences,
  onSelectContent,
  variant = "default", // "default" | "survey"
  selectedContent,
}) {
  const videos = isPersonalized ? PERSONALIZED_VIDEOS : POPULAR_VIDEOS;

  const handleCardClick = (video) => {
    if (onSelectContent) {
      onSelectContent(video);
    }
  };

  const getHeaderContent = () => {
    if (isPersonalized && userPreferences) {
      const age =
        new Date().getFullYear() - parseInt(userPreferences.birthYear);
      const genderText = userPreferences.gender === "female" ? "Female" : "Male";
      return {
        title: `Customized Travel Destinations for ${genderText} in ${age}s`,
        subtitle: "We recommend Korean travel destinations that perfectly match your preferences.",
      };
    }
    return {
      title: "Popular K-Content TOP 10",
      subtitle:
        "We've gathered the most popular Korean dramas, variety shows, movies, and vlogs all in one place.",
    };
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <section
      className={`k-carousel ${
        variant === "survey" ? "k-carousel--survey" : ""
      }`}
    >
      {variant !== "survey" && (
        <div className="k-carousel-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {isPersonalized &&
            userPreferences?.genres &&
            userPreferences.genres.length > 0 && (
              <div className="preference-tags">
                {userPreferences.genres.slice(0, 3).map((genre) => (
                  <span key={genre} className="preference-tag">
                    #{genre}
                  </span>
                ))}
              </div>
            )}
        </div>
      )}

      <div className="k-carousel-track-wrapper">
        <div className="k-carousel-track">
          {videos.map((video) => (
            <article
              key={video.id}
              className={`k-video-card ${
                selectedContent?.id === video.id ? "k-video-card--selected" : ""
              }`}
              onClick={() => handleCardClick(video)}
            >
              <div className="k-video-thumb">
                {video.image ? (
                  <img src={video.image} alt={video.title} />
                ) : (
                  <div className="k-thumb-placeholder">K</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
