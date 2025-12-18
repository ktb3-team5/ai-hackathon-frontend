import { useState } from "react";
import "../styles/TravelCarousel.css";

const CARDS = [
  {
    id: 1,
    title: "수원 신상 핫플\n색다른 문화공간",
    image: "/images/top1.png",
  },
  {
    id: 2,
    title: "포항에서 느끼는\nDMZ 평화관광 명소",
    image: "/images/top2.png",
  },
  {
    id: 3,
    title: "접경지역에서 만나는\n특별한 겨울",
    image: "/images/top3.png",
  },
  {
    id: 4,
    title: "겨울 낭만 가득,\n여수로 떠나는 가족여행 🎄",
    image: "/images/top4.png",
  },
  {
    id: 5,
    title: "감성 가득한\n워크앤휴식 스팟",
    image: "/images/top5.png",
  },
];

export default function TravelCarousel({ onSelect }) {
  // ❗️중요: modulo 제거
  const [center, setCenter] = useState(0);
  const total = CARDS.length;

  // ❗️그냥 계속 증가/감소
  const move = (dir) => {
    setCenter((prev) => prev + dir);
  };

  return (
    <section className="bookshelf-section">
      <h2>지금 떠나기 좋은 여행 코스 추천!</h2>

      <div className="bookshelf">
        {CARDS.map((card, idx) => {
          /**
           * 🔥 핵심 로직
           * - center는 무한히 증가
           * - 화면에 보이는 위치 계산에서만 modulo
           */
          const virtualIndex = idx + Math.floor(center / total) * total;

          let diff = virtualIndex - center;

          // 반대 방향 카드도 자연스럽게 보이게 보정
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          // 너무 멀면 렌더 제외
          if (Math.abs(diff) > 3) return null;

          return (
            <div
              key={`${card.id}-${virtualIndex}`} // ⭐️ 중요: virtualIndex
              className="book-card"
              style={{
                transform: `
                  translateX(${diff * 160}px)
                  scale(${1 - Math.abs(diff) * 0.12})
                `,
                zIndex: 10 - Math.abs(diff),
                opacity: 1 - Math.abs(diff) * 0.15,
              }}
              onClick={() =>
                diff === 0 ? onSelect?.() : setCenter((prev) => prev + diff)
              }
            >
              <img src={card.image} alt={card.title} />
              <div className="overlay">
                <p>{card.title}</p>
              </div>
              <button className="heart">♡</button>
            </div>
          );
        })}
      </div>

      <div className="controls">
        <button onClick={() => move(-1)}>‹</button>
        <button onClick={() => move(1)}>›</button>
      </div>
    </section>
  );
}
