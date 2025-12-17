import { useEffect, useState } from "react";
import "../styles/Canvas.css";
import FloatingCard from "./FloatingCard";
// import SearchPill from "./SearchPill";
import SiteBadge from "./SiteBadge";

const TOTAL_FRAMES = 5;

export default function Canvas() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [secondInCycle, setSecondInCycle] = useState(0); // 0,1,2,3,4,5,6 → 3초 노출 + 2초 사라짐 + 2초 대기 후 새 프레임

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondInCycle((prev) => {
        const next = (prev + 1) % 7;
        // 사라진 후 대기 시간이 끝날 때 프레임 인덱스 증가 (카드 세트 교체)
        if (next === 5) {
          setFrameIndex((prevFrame) => (prevFrame + 1) % TOTAL_FRAMES);
        }
        return next;
      });
    }, 1000); // 1초마다 틱

    return () => clearInterval(interval);
  }, []);

  const isVisible = secondInCycle < 3 || secondInCycle >= 5; // 0,1,2,5,6초: 보임 / 3,4초: 사라지는 구간

  return (
    <section className="canvas">
      {/* 떠있는 카드들 (지금은 placeholder 색으로, 나중에 이미지로 교체) */}
      <FloatingCard
        id="c1"
        className="c1"
        frameIndex={frameIndex}
        isVisible={isVisible}
      />
      <FloatingCard
        id="c2"
        className="c2"
        frameIndex={frameIndex}
        isVisible={isVisible}
      />
      <FloatingCard
        id="c3"
        className="c3"
        frameIndex={frameIndex}
        isVisible={isVisible}
      />
      <FloatingCard
        id="c4"
        className="c4"
        frameIndex={frameIndex}
        isVisible={isVisible}
      />
      <FloatingCard
        id="c5"
        className="c5"
        frameIndex={frameIndex}
        isVisible={isVisible}
      />
      <FloatingCard
        id="c6"
        className="c6"
        frameIndex={frameIndex}
        isVisible={isVisible}
      />
      <FloatingCard
        id="c7"
        className="c7"
        frameIndex={frameIndex}
        isVisible={isVisible}
      />

      {/* <SearchPill /> */}
    </section>
  );
}
