import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react";

const image1 = "/Assets/public_assets/images/event/workshop.jpeg";
const image2 = "/Assets/public_assets/images/event/teachers-workshop.jpg";
const image3 = "/Assets/public_assets/images/event/workshop2.jpeg";
const image4 = "/Assets/public_assets/images/event/teachersworkshop2.jpg"; 
const image5 = "/Assets/public_assets/images/event/teacherswebinar.png";
const image6 = "/Assets/public_assets/images/event/parentswebinar.png";
const image7 = "/Assets/public_assets/images/event/aisummit.jpg";
const image8 = "/Assets/public_assets/images/event/aidayevent2.jpg";

const data = [
  {
    place: "DAV Public School, Derabassi",
    title: "HANDS-ON",
    title2: "TECH WORKSHOP",
    description:
      "An engaging hands-on workshop at DAV Public School, Derabassi, where students explored technology through interactive learning and live demonstrations. Curiosity, creativity, and innovation came together as young minds gained practical exposure to exciting tech concepts!",
    image: image1,
  },
  {
    place: "Lala Deep Jain Public School",
    title: "AI & ROBOTICS",
    title2: "WORKSHOP",
    description:
      "An exciting AI & Robotics Workshop at Lala Deep Jain Public School, inspiring students to explore, learn, and innovate. A step towards building future-ready young minds!",
    image: image3,
  },
  {
    place: "Sri Sukhmani Group of Institutions, Derabassi",
    title: "AI & ROBOTICS",
    title2: "TEACHER WORKSHOP",
    description:
      "AI & Robotics Teacher Workshop conducted at Sri Sukhmani Group of Institutions, Derabassi, empowering teachers with practical knowledge of AI tools and robotics technologies for innovative classroom learning.",
    image: image2,
  },
  {
    place: "Sri Sukhmani Group of Institutions, Derabassi",
    title: "ROBOTICS CAR",
    title2: "HANDS-ON DEMO",
    description:
      "Teachers explored and interacted with our Robotics Car during the AI & Robotics Teacher Workshop. The hands-on demonstration helped them understand robotics concepts and real-world applications of automation.",
    image: image4,
  },
  {
    place: "Teachers Webinar",
    title: "FROM BORING",
    title2: "TO BRILLIANT",
    description:
      "A webinar “From Boring to Brilliant” was conducted for teachers, focusing on the power of AI in transforming teaching and learning experiences. The session highlighted how teachers can use AI tools to create more engaging, personalized, and effective classrooms.",
    image: image5,
  },
  {
    place: "Parent Webinar",
    title: "SCREEN TIME",
    title2: "TO SKILL TIME",
    description:
      "A parent webinar “Screen Time Ko Banao Skill Time” was conducted to guide parents on making children’s screen usage more productive and skill-oriented. The session focused on using AI tools creatively for learning, exploration, and digital growth.",
    image: image6,
  },
  {
    place: "Dashmesh Khalsa College, Zirakpur",
    title: "AI SUMMIT",
    title2: "FOR SCHOOLS",
    description:
      "AI Summit for School Management was conducted at Dashmesh Khalsa College, Zirakpur, bringing together educators and leaders to explore the role of AI in transforming education. The session focused on AI-driven innovation, future-ready learning, and technology integration in schools.",
    image: image7,
  },
  {
    place: "St. Soldier Punjab Public School",
    title: "AI DAY",
    title2: "POSTER DESIGN",
    description:
      "Students showcased their creativity by designing AI-based posters during the AI Day Event at St. Soldier Punjab Public School. The activity encouraged young minds to explore Artificial Intelligence through creativity and innovation.",
    image: image8,
  },
];

const css = `
.gx {
  --gx-navy: #05081c;
  --gx-blue: #1ba7ff;
  --gx-blue-deep: #2563eb;
  --gx-blue-light: #3fa9f5;
  --gx-blue-glow: #1fc8ff;
  --gx-text: #ffffff;
  --gx-text-muted: #aab6d4;
  --gx-font-sans: var(--foc-font-sans, "Inter", system-ui, sans-serif);
  --gx-font-display: var(--foc-font-display, "Orbitron", "Inter", system-ui, sans-serif);

  position: relative;
  width: 100%;
  height: min(100vh, 900px);
  min-height: 560px;
  overflow: hidden;
  background-color: var(--gx-navy);
  color: var(--gx-text);
  font-family: var(--gx-font-sans);
}
.gx .card {
  position: absolute;
  left: 0;
  top: 0;
  background-position: center;
  background-size: cover;
  box-shadow: 6px 6px 10px 2px rgba(0,0,0,0.6);
  will-change: transform;
  overflow: hidden;
}
.gx .card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(5, 8, 28, 0.08) 0%,
    rgba(5, 8, 28, 0.05) 42%,
    rgba(5, 8, 28, 0.45) 70%,
    rgba(5, 8, 28, 0.78) 100%
  );
}
.gx .scrim {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(5, 8, 28, 0.55) 0%, rgba(5, 8, 28, 0.28) 38%, rgba(5, 8, 28, 0.06) 62%, transparent 100%),
    linear-gradient(180deg, rgba(5, 8, 28, 0.2) 0%, transparent 30%, transparent 68%, rgba(5, 8, 28, 0.25) 100%);
}
.gx .card-content {
  position: absolute;
  left: 0;
  top: 0;
  color: var(--gx-text);
  padding: 20px 14px 14px;
  pointer-events: none;
  text-shadow: 0 2px 12px rgba(5, 8, 28, 0.65);
  background: linear-gradient(
    180deg,
    rgba(5, 8, 28, 0) 0%,
    rgba(5, 8, 28, 0.38) 38%,
    rgba(5, 8, 28, 0.82) 100%
  );
  border-radius: 0 0 10px 10px;
  box-sizing: border-box;
  height: 110px;
}
.gx .content-place { margin-top: 6px; font-size: 12px; font-weight: 600; color: var(--gx-text); font-family: var(--gx-font-sans); }
.gx .content-title-1, .gx .content-title-2 { font-weight: 700; font-size: 17px; font-family: var(--gx-font-display); color: var(--gx-text); line-height: 1.15; letter-spacing: -0.02em; }
.gx .content-start { width: 30px; height: 4px; border-radius: 99px; background-color: var(--gx-blue-glow); }

.gx .details {
  z-index: 22;
  position: absolute;
  top: 22%;
  left: clamp(20px, 4vw, 60px);
  max-width: min(460px, 40vw);
  padding: 8px 4px 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.gx .details .place-box { height: 46px; overflow: hidden; position: relative; }
.gx .details .place-box .text {
  padding-top: 16px;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  color: var(--gx-text);
  font-family: var(--gx-font-sans);
  letter-spacing: 0.04em;
  text-shadow: 0 1px 2px rgba(5,8,28,0.95), 0 6px 20px rgba(5,8,28,0.8);
}
.gx .details .place-box .text:before { top: 0; left: 0; position: absolute; content: ""; width: 30px; height: 4px; border-radius: 99px; background: linear-gradient(90deg, var(--gx-blue-light), var(--gx-blue-glow)); }
.gx .details .title-1, .gx .details .title-2 {
  font-weight: 800;
  font-size: clamp(22px, 4.5vw, 35px);
  font-family: var(--gx-font-display);
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--gx-text);
  text-shadow: 0 2px 4px rgba(5,8,28,0.8), 0 8px 28px rgba(5,8,28,0.55);
}
.gx .details .title-box-1, .gx .details .title-box-2 { margin-top: 2px; height: clamp(40px, 5vw, 70px); overflow: hidden; }
.gx .details > .desc {
  margin-top: 16px;
  width: 100%;
  max-width: 500px;
  font-size: clamp(13px, 1.2vw, 15px);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.92);
  font-family: var(--gx-font-sans);
  text-shadow: 0 1px 2px rgba(5,8,28,0.95), 0 6px 18px rgba(5,8,28,0.75);
}
.gx .details > .cta {
  width: 100%;
  margin-top: 24px;
  margin-bottom: 88px;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(10, 18, 48, 0.55);
  border: 1px solid rgba(63, 169, 245, 0.22);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.gx .details > .cta > .bookmark {
  border: none;
  background-color: var(--gx-blue-deep);
  width: 36px;
  height: 36px;
  border-radius: 99px;
  color: white;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.gx .details > .cta > .discover {
  border: 1.5px solid rgba(255, 255, 255, 0.75);
  background-color: rgba(37, 99, 235, 0.28);
  height: 36px;
  border-radius: 8px;
  color: var(--gx-text);
  padding: 4px 22px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 16px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-family: var(--gx-font-sans);
  cursor: pointer;
}

.gx .indicator { display: none; }

.gx .pagination {
  position: absolute;
  left: 50%;
  right: auto;
  top: auto;
  bottom: 28px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: max-content;
  z-index: 90;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(5, 8, 28, 0.88);
  border: 1px solid rgba(63, 169, 245, 0.55);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
  pointer-events: auto;
}
.gx .pagination > .arrow {
  z-index: 90;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 999px;
  border: 1.5px solid rgba(63, 169, 245, 0.95);
  display: grid;
  place-items: center;
  color: #ffffff;
  cursor: pointer;
  background: rgba(37, 99, 235, 0.85);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}
.gx .pagination > .arrow:hover,
.gx .pagination > .arrow:focus-visible {
  background: #1ba7ff;
  border-color: #ffffff;
}
.gx .pagination .progress-sub-container { display: none; }
.gx .pagination .slide-numbers { width: 48px; height: 48px; overflow: hidden; z-index: 60; position: relative; }
.gx .pagination .slide-numbers .item { width: 48px; height: 48px; position: absolute; color: var(--gx-text); top: 0; left: 0; display: grid; place-items: center; font-size: 24px; font-weight: 800; font-family: var(--gx-font-display); text-shadow: 0 2px 8px rgba(5,8,28,0.6); }

.gx .cover { position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: var(--gx-navy); z-index: 100; pointer-events: none; }

@media (max-width: 980px) {
  .gx { height: min(100vh, 760px); min-height: 520px; }
  .gx .details { top: 18%; left: 24px; max-width: min(420px, 88vw); }
  .gx .details .title-box-1, .gx .details .title-box-2 { height: 56px; }
}

@media (max-width: 640px) {
  .gx { height: 560px; min-height: 520px; max-height: 70svh; }
  .gx .details { top: 12%; left: 16px; max-width: calc(100% - 32px); padding: 8px 0 0; }
  .gx .details .title-1, .gx .details .title-2 { font-size: 24px; }
  .gx .details .title-box-1, .gx .details .title-box-2 { height: 36px; }
  .gx .details > .desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .gx .details > .cta { display: none; }
  .gx .card-content { display: none; }
  .gx .pagination {
    left: 50%;
    right: auto;
    bottom: 16px;
    transform: translateX(-50%);
    justify-content: center;
  }
  .gx .pagination > .arrow {
    width: 48px;
    height: 48px;
    background: #2563eb;
  }
}
`;

function Carousel() {
  const rootRef = useRef(null);
  const indicatorRef = useRef(null);
  const paginationRef = useRef(null);
  const coverRef = useRef(null);
  const detailsEvenRef = useRef(null);
  const detailsOddRef = useRef(null);
  const progressFgRef = useRef(null);

  const cardRefs = useRef([]);
  const cardContentRefs = useRef([]);
  const sliderItemRefs = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const cards = cardRefs.current;
    const cardContents = cardContentRefs.current;
    const sliderItems = sliderItemRefs.current;

    let order = data.map((_, i) => i);
    let detailsEven = true;
    let offsetTop = 200;
    let offsetLeft = 700;
    let stageW = root.clientWidth;
    let stageH = root.clientHeight;
    let cardWidth = 200;
    let cardHeight = 300;
    let gap = 40;
    const numberSize = 50;
    const ease = "sine.inOut";
    let stopped = false;
    let busy = false;

    const getSize = () => {
      stageW = root.clientWidth || window.innerWidth;
      stageH = root.clientHeight || window.innerHeight;
      const compact = stageW < 980;
      const mobile = stageW < 640;
      if (mobile) {
        gap = 10;
        cardWidth = 84;
        cardHeight = 118;
        offsetTop = stageH - cardHeight - 72;
        offsetLeft = Math.max(12, stageW - 2 * (cardWidth + gap) - 12);
      } else if (compact) {
        gap = 24;
        cardWidth = Math.min(160, stageW * 0.28);
        cardHeight = Math.min(240, stageH * 0.38);
        offsetTop = Math.max(120, stageH - cardHeight - 110);
        offsetLeft = Math.max(24, stageW - 520);
      } else {
        gap = 40;
        cardWidth = 200;
        cardHeight = 300;
        offsetTop = Math.max(120, stageH - cardHeight - 130);
        offsetLeft = Math.max(24, stageW - 830);
      }
    };

    const isMobile = () => (root.clientWidth || window.innerWidth) < 640;

    const getCard = (i) => cards[i];
    const getCardContent = (i) => cardContents[i];
    const getSliderItem = (i) => sliderItems[i];

    const hidePreviewCard = (i) => {
      gsap.set(getCard(i), {
        x: stageW + 80,
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        opacity: 0,
        zIndex: 1,
        borderRadius: 10,
        scale: 1,
      });
      gsap.set(getCardContent(i), {
        x: stageW + 80,
        y: offsetTop,
        width: cardWidth,
        height: 110,
        opacity: 0,
        zIndex: 1,
      });
    };

    function init() {
      getSize();
      const [active, ...rest] = order;
      const detailsActive = detailsEven ? detailsEvenRef.current : detailsOddRef.current;
      const detailsInactive = detailsEven ? detailsOddRef.current : detailsEvenRef.current;
      const progressW = Math.min(420, stageW * 0.36);

      gsap.set(paginationRef.current, { opacity: 1, zIndex: 90 });

      gsap.set(getCard(active), { x: 0, y: 0, width: stageW, height: stageH, borderRadius: 0, opacity: 1 });
      gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
      gsap.set(detailsActive, { opacity: 1, zIndex: 22, x: 0 });
      gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
      gsap.set(detailsInactive.querySelector(".text"), { y: 100 });
      gsap.set(detailsInactive.querySelector(".title-1"), { y: 100 });
      gsap.set(detailsInactive.querySelector(".title-2"), { y: 100 });
      gsap.set(detailsInactive.querySelector(".desc"), { y: 50 });
      gsap.set(detailsInactive.querySelector(".cta"), { y: 60 });

      gsap.set(progressFgRef.current, { width: progressW * (1 / order.length) * (active + 1) });

      rest.forEach((i, index) => {
        if (isMobile()) {
          hidePreviewCard(i);
          gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
          return;
        }
        gsap.set(getCard(i), {
          x: offsetLeft + 400 + index * (cardWidth + gap),
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 30,
          borderRadius: 10,
        });
        gsap.set(getCardContent(i), {
          x: offsetLeft + 400 + index * (cardWidth + gap),
          zIndex: 40,
          y: offsetTop + cardHeight - 110,
          width: cardWidth,
          height: 110,
        });
        gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
      });

      gsap.set(indicatorRef.current, { x: -stageW });
      gsap.set(coverRef.current, { x: stageW + 400, opacity: 0 });

      rest.forEach((i, index) => {
        if (isMobile()) return;
        gsap.to(getCard(i), { x: offsetLeft + index * (cardWidth + gap), zIndex: 30, ease, delay: 0.2 });
        gsap.to(getCardContent(i), {
          x: offsetLeft + index * (cardWidth + gap),
          y: offsetTop + cardHeight - 110,
          width: cardWidth,
          height: 110,
          zIndex: 40,
          ease,
          delay: 0.2,
        });
      });
    }

    function step(dir = 1) {
      return new Promise((resolve) => {
        getSize();
        if (dir === 1) order.push(order.shift());
        else order.unshift(order.pop());
        detailsEven = !detailsEven;

        const detailsActive = detailsEven ? detailsEvenRef.current : detailsOddRef.current;
        const detailsInactive = detailsEven ? detailsOddRef.current : detailsEvenRef.current;
        const progressW = Math.min(420, stageW * 0.36);

        detailsActive.querySelector(".place-box .text").textContent = data[order[0]].place;
        detailsActive.querySelector(".title-1").textContent = data[order[0]].title;
        detailsActive.querySelector(".title-2").textContent = data[order[0]].title2;
        detailsActive.querySelector(".desc").textContent = data[order[0]].description;

        gsap.set(detailsActive, { zIndex: 22 });
        gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
        gsap.to(detailsActive.querySelector(".text"), { y: 0, delay: 0.1, duration: 0.7, ease });
        gsap.to(detailsActive.querySelector(".title-1"), { y: 0, delay: 0.15, duration: 0.7, ease });
        gsap.to(detailsActive.querySelector(".title-2"), { y: 0, delay: 0.15, duration: 0.7, ease });
        gsap.to(detailsActive.querySelector(".desc"), { y: 0, delay: 0.3, duration: 0.4, ease });
        gsap.to(detailsActive.querySelector(".cta"), { y: 0, delay: 0.35, duration: 0.4, onComplete: resolve, ease });
        gsap.set(detailsInactive, { zIndex: 12 });

        const [active, ...rest] = order;
        const prv = dir === 1 ? rest[rest.length - 1] : rest[0];

        gsap.set(getCard(prv), { zIndex: 10 });
        gsap.set(getCard(active), { zIndex: 20 });
        if (!isMobile()) {
          gsap.to(getCard(prv), { scale: 1.5, ease });
        }

        gsap.to(getCardContent(active), { y: offsetTop + cardHeight - 10, opacity: 0, duration: 0.3, ease });
        gsap.to(getSliderItem(active), { x: 0, ease });
        gsap.to(getSliderItem(prv), { x: -numberSize, ease });
        gsap.to(progressFgRef.current, { width: progressW * (1 / order.length) * (active + 1), ease });

        gsap.to(getCard(active), {
          x: 0,
          y: 0,
          ease,
          opacity: 1,
          width: stageW,
          height: stageH,
          borderRadius: 0,
          onComplete: () => {
            if (isMobile()) {
              hidePreviewCard(prv);
            } else {
              const prvIndex = dir === 1 ? rest.length - 1 : 0;
              const xNew = offsetLeft + prvIndex * (cardWidth + gap);
              gsap.set(getCard(prv), {
                x: xNew,
                y: offsetTop,
                width: cardWidth,
                height: cardHeight,
                zIndex: 30,
                borderRadius: 10,
                scale: 1,
              });
              gsap.set(getCardContent(prv), {
                x: xNew,
                y: offsetTop + cardHeight - 110,
                width: cardWidth,
                height: 110,
                opacity: 1,
                zIndex: 40,
              });
            }
            gsap.set(getSliderItem(prv), { x: rest.length * numberSize });

            gsap.set(detailsInactive, { opacity: 0 });
            gsap.set(detailsInactive.querySelector(".text"), { y: 100 });
            gsap.set(detailsInactive.querySelector(".title-1"), { y: 100 });
            gsap.set(detailsInactive.querySelector(".title-2"), { y: 100 });
            gsap.set(detailsInactive.querySelector(".desc"), { y: 50 });
            gsap.set(detailsInactive.querySelector(".cta"), { y: 60 });
          },
        });

        rest.forEach((i, index) => {
          if (i === prv) return;
          gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
          if (isMobile()) {
            hidePreviewCard(i);
            return;
          }
          const xNew = offsetLeft + index * (cardWidth + gap);
          gsap.set(getCard(i), { zIndex: 30 });
          gsap.to(getCard(i), {
            x: xNew,
            y: offsetTop,
            width: cardWidth,
            height: cardHeight,
            ease,
            delay: 0.1 * (index + 1),
          });
          gsap.to(getCardContent(i), {
            x: xNew,
            y: offsetTop + cardHeight - 110,
            width: cardWidth,
            height: 110,
            opacity: 1,
            zIndex: 40,
            ease,
            delay: 0.1 * (index + 1),
          });
        });
      });
    }

    function go(dir) {
      if (busy || stopped) return;
      busy = true;
      step(dir).finally(() => {
        busy = false;
      });
    }

    const onPrev = (e) => {
      e.preventDefault();
      e.stopPropagation();
      go(-1);
    };
    const onNext = (e) => {
      e.preventDefault();
      e.stopPropagation();
      go(1);
    };

    const leftBtn = paginationRef.current?.querySelector(".arrow-left");
    const rightBtn = paginationRef.current?.querySelector(".arrow-right");
    leftBtn?.addEventListener("click", onPrev);
    rightBtn?.addEventListener("click", onNext);

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    async function start() {
      try {
        await Promise.all(data.map((d) => loadImage(d.image)));
        if (!stopped) init();
      } catch (e) {
        console.error("One or more images failed to load", e);
        if (!stopped) init();
      }
    }

    start();

    return () => {
      stopped = true;
      leftBtn?.removeEventListener("click", onPrev);
      rightBtn?.removeEventListener("click", onNext);
      gsap.killTweensOf(cards);
      gsap.killTweensOf(cardContents);
      gsap.killTweensOf(sliderItems);
      gsap.killTweensOf(indicatorRef.current);
      gsap.killTweensOf(paginationRef.current);
      gsap.killTweensOf(coverRef.current);
      gsap.killTweensOf(progressFgRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDetails = (refObj) => (
    <div className="details" ref={refObj}>
      <div className="place-box">
        <div className="text">{data[0].place}</div>
      </div>
      <div className="title-box-1">
        <div className="title-1">{data[0].title}</div>
      </div>
      <div className="title-box-2">
        <div className="title-2">{data[0].title2}</div>
      </div>
      <div className="desc">{data[0].description}</div>
      <div className="cta">
        <button type="button" className="bookmark" aria-label="Bookmark">
          <Bookmark size={20} />
        </button>
        <button type="button" className="discover">Discover Location</button>
      </div>
    </div>
  );

  return (
    <div className="gx" ref={rootRef}>
      <style>{`${css}`}</style>

      <div className="indicator" ref={indicatorRef} />

      <div id="demo">
        {data.map((d, i) => (
          <div
            key={`card-${i}`}
            className="card"
            ref={(el) => (cardRefs.current[i] = el)}
            style={{ backgroundImage: `url(${d.image})` }}
          />
        ))}
        {data.map((d, i) => (
          <div key={`content-${i}`} className="card-content" ref={(el) => (cardContentRefs.current[i] = el)}>
            <div className="content-start" />
            <div className="content-place">{d.place}</div>
            <div className="content-title-1">{d.title}</div>
            <div className="content-title-2">{d.title2}</div>
          </div>
        ))}
      </div>

      <div className="scrim" aria-hidden="true" />

      {renderDetails(detailsEvenRef)}
      {renderDetails(detailsOddRef)}

      <div className="pagination" ref={paginationRef}>
        <button type="button" className="arrow arrow-left" aria-label="Previous">
          <ChevronLeft size={24} />
        </button>
        <div className="slide-numbers">
          {data.map((_, i) => (
            <div key={`num-${i}`} className="item" ref={(el) => (sliderItemRefs.current[i] = el)}>
              {i + 1}
            </div>
          ))}
        </div>
        <button type="button" className="arrow arrow-right" aria-label="Next">
          <ChevronRight size={24} />
        </button>
        <div className="progress-sub-foreground" ref={progressFgRef} hidden />
      </div>

      <div className="cover" ref={coverRef} />
    </div>
  );
}

export default Carousel;
