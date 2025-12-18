import "../styles/KoreanCarousel.css";

// 개인화된 콘텐츠 (A 루트 - 설문 참여)
const PERSONALIZED_VIDEOS = [
  {
    id: 1,
    title: "당신을 위한 추천 여행지",
    tag: "RECOMMEND",
    duration: "10:30",
    image: "/images/image.png",
  },
  {
    id: 2,
    title: "취향 맞춤 힐링 스팟",
    tag: "HEALING",
    duration: "08:45",
    image: "/images/image2.png",
  },
  {
    id: 3,
    title: "맞춤형 액티비티 체험",
    tag: "ACTIVITY",
    duration: "12:20",
    image: "/images/image3.png",
  },
  {
    id: 4,
    title: "추천 맛집 투어",
    tag: "FOOD",
    duration: "15:10",
    image: "/images/image4.png",
  },
  {
    id: 5,
    title: "문화 체험 명소",
    tag: "CULTURE",
    duration: "09:50",
    image: "/images/image5.png",
  },
];

// 대중적 콘텐츠 (B 루트 - 설문 건너뛰기 & 설문 마지막 단계 TOP10)
const POPULAR_VIDEOS = [
  {
    id: 1,
    title: "흑백요리사",
    tag: "TOP 1",
    image: "/images/top1.png",
  },
  {
    id: 2,
    title: "자백의 대가",
    tag: "TOP 2",
    duration: "08:20",
    image: "/images/top2.png",
  },
  {
    id: 3,
    title: "프로보노",
    tag: "TOP 3",
    duration: "03:45",
    image: "/images/top3.png",
  },
  {
    id: 4,
    title: "불량연애",
    tag: "TOP 4",
    duration: "15:02",
    image: "/images/top4.png",
  },
  {
    id: 5,
    title: "모범택시3",
    tag: "TOP 5",
    duration: "06:18",
    image: "/images/top5.png",
  },
  {
    id: 6,
    title: "다음생은 없으니까",
    tag: "TOP 6",
    duration: "07:12",
    image: "/images/top6.png",
  },
  {
    id: 7,
    title: "케냐간세끼",
    tag: "TOP 7",
    duration: "05:55",
    image: "/images/top7.png",
  },
  {
    id: 8,
    title: "키스는 괜히 해서",
    tag: "TOP 8",
    duration: "09:40",
    image: "/images/top8.png",
  },
  {
    id: 9,
    title: "케이팝 데몬 헌터스",
    tag: "TOP 9",
    duration: "04:28",
    image: "/images/top9.png",
  },
  {
    id: 10,
    title: "전지적 독자 시점",
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
      const genderText = userPreferences.gender === "female" ? "여성" : "남성";
      return {
        title: `${age}대 ${genderText}을 위한 맞춤 여행지`,
        subtitle: "당신의 취향에 딱 맞는 한국 여행지를 추천해드려요.",
      };
    }
    return {
      title: "인기 K-콘텐츠 TOP 10",
      subtitle:
        "지금 가장 인기있는 한국 드라마, 예능, 영화, 브이로그를 한 번에 모아봤어요.",
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
