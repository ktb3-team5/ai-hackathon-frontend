import { useMemo } from "react";
import "../styles/FloatingCard.css";

// 각 카드에 매칭될 이미지
const TOP_IMAGES = [
  "/images/top1.png",
  "/images/top2.png",
  "/images/top3.png",
  "/images/top4.png",
  "/images/top5.png",
  "/images/top6.png",
  "/images/top7.png",
  "/images/top8.png",
  "/images/top9.png",
  "/images/top10.png",
];

const CARD_IMAGE_POOLS = {
  c1: ["/images/image.png"],
  c2: ["/images/image2.png"],
  c3: ["/images/image3.png"],
  c4: ["/images/image4.png"],
  c5: ["/images/image5.png"],
  c6: ["/images/image6.png"],
  c7: ["/images/image7.png"],
};

// 각 카드 슬롯별 기본 사이즈 (기존 CSS 값)
const BASE_SIZES = {
  c1: { width: 220, height: 120 },
  c2: { width: 160, height: 110 },
  c3: { width: 140, height: 80 },
  c4: { width: 360, height: 170 },
  c5: { width: 120, height: 70 },
  c6: { width: 380, height: 240 },
  c7: { width: 260, height: 210 },
};

// 카드별로 살짝 다른 패턴을 주기 위한 오프셋 (순차 등장/퇴장에 사용)
const ID_OFFSET = {
  c1: 0,
  c2: 1,
  c3: 2,
  c4: 3,
  c5: 4,
  c6: 5,
  c7: 6,
};

// 간단한 의사 난수 생성기 (id + frameIndex 기반으로 0~1 실수 리턴)
function rand01(id, frameIndex, salt) {
  const str = `${id}-${frameIndex}-${salt}`;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function getVariant(id, frameIndex) {
  const base = BASE_SIZES[id] || { width: 220, height: 120 };

  // 가로/세로를 따로 스케일링해서 정사각형~길쭉한 직사각형까지 다양하게
  // 0.6 ~ 1.4 범위에서 랜덤
  const widthScale = 0.6 + rand01(id, frameIndex, 1) * 0.8;
  const heightScale = 0.6 + rand01(id, frameIndex, 2) * 0.8;

  // -24 ~ +24px 사이에서 위치를 조금 더 다양하게 흔들기
  const jitterX = (rand01(id, frameIndex, 3) - 0.5) * 48;
  const jitterY = (rand01(id, frameIndex, 4) - 0.5) * 48;

  // 0.08 ~ 0.22 사이로 명암도 약간씩 다르게
  const alpha = 0.08 + rand01(id, frameIndex, 5) * 0.14;

  return {
    width: Math.round(base.width * widthScale),
    height: Math.round(base.height * heightScale),
    translateX: jitterX,
    translateY: jitterY,
    color: `rgba(0, 0, 0, ${alpha.toFixed(2)})`,
  };
}

function pickImage(id, frameIndex) {
  const pool = [...(CARD_IMAGE_POOLS[id] || []), ...TOP_IMAGES];
  if (pool.length === 0) return undefined;
  const index = Math.floor(rand01(id, frameIndex, 99) * pool.length);
  return pool[index];
}

export default function FloatingCard({
  id,
  className = "",
  frameIndex = 0,
  isVisible = true,
}) {
  const variant = useMemo(() => getVariant(id, frameIndex), [id, frameIndex]);
  const imageUrl = useMemo(() => pickImage(id, frameIndex), [id, frameIndex]);

  const offset = ID_OFFSET[id] ?? 0;
  const maxOffset = 6; // c1~c7 기준
  const hideDelayMs = offset * 150; // 하나씩 0.15초 간격으로 사라짐
  const showDelayMs = (maxOffset - offset) * 150; // 반대 순서로 나타나게

  return (
    <div
      className={`card ${className}`}
      style={{
        width: `${variant.width}px`,
        height: `${variant.height}px`,
        backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: imageUrl ? "transparent" : variant.color,
        transform: `translate(${variant.translateX}px, ${variant.translateY}px)`,
        opacity: isVisible ? 1 : 0,
        transitionDelay: isVisible ? `${showDelayMs}ms` : `${hideDelayMs}ms`,
      }}
    />
  );
}
