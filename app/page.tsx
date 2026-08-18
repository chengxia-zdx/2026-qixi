"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const journeys = [
  {
    date: "2024.04.14",
    place: "故事开始",
    copy: "春天和星星，从这一天起有了共同的轨道。",
    image: "images/birthday-together-1.jpg",
    imageAlt: "春春和星星的合照",
  },
  {
    date: "2024 · 国庆",
    place: "成都 · 重庆",
    copy: "第一次一起出游。吃香喝辣，也把山城的路一步步走成回忆。",
    image: "images/journeys/chengdu-chongqing.jpg",
    imageAlt: "重庆山城夜景",
  },
  {
    date: "2024.11",
    place: "泰国",
    copy: "在异国风情里体验新鲜事物，也一起尝试了从未有过的放松时刻。",
    image: "images/journeys/thailand.jpg",
    imageAlt: "泰国寺庙与湖面的风景",
  },
  {
    date: "2025.03.10",
    place: "天津",
    copy: "生日、皇冠和一份认真准备的礼物。比礼物更珍贵的，是你笑起来的样子。",
    image: "images/journeys/tianjin.jpg",
    imageAlt: "夜色里的城市与灯光",
  },
  {
    date: "2025 · 五一",
    place: "广州",
    copy: "把假期过成共同记忆，把普通的一天变成以后会想起的一天。",
    image: "images/journeys/guangzhou.jpg",
    imageAlt: "广州城市风景",
  },
  {
    date: "2025.10",
    place: "大连",
    copy: "一起吹过北方的海风，也把新的风景装进了我们的故事。",
    image: "images/journeys/dalian.jpg",
    imageAlt: "海边的浪花与沙滩",
  },
  {
    date: "2025.11",
    place: "日本",
    copy: "世界很大，下一站在哪里不重要，重要的是身边依然有你。",
    image: "images/journeys/japan.jpg",
    imageAlt: "日本古建筑与街巷",
  },
];

const wishes = [
  "一起去更多没去过的地方",
  "拍下更多属于我们的合照",
  "认真过好每一个普通日子",
  "把故事一直写到很久以后",
];

const scenes = [
  { id: "cover", label: "封面" },
  { id: "journey", label: "旅途" },
  { id: "birthday", label: "生日" },
  { id: "reunion", label: "重逢" },
  { id: "future", label: "未来" },
  { id: "blessing", label: "祝福" },
];

const heartStyles = Array.from({ length: 14 }, (_, index) =>
  ({
    "--heart-index": index,
    "--heart-x": `${(index % 7) * 13 - 39}px`,
    "--heart-delay": `${(index % 5) * 0.07}s`,
  }) as CSSProperties,
);

const sparkleStyles = Array.from({ length: 10 }, (_, index) =>
  ({
    "--sparkle-index": index,
    "--sparkle-delay": `${(index % 5) * 0.18}s`,
  }) as CSSProperties,
);

export default function Home() {
  const storyRoot = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [litWishes, setLitWishes] = useState<number[]>([]);
  const [letterOpen, setLetterOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const root = storyRoot.current;
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveScene(Number((visible.target as HTMLElement).dataset.scene));
      },
      { root, threshold: [0.55, 0.72] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const goToScene = (index: number) => {
    const next = Math.max(0, Math.min(scenes.length - 1, index));
    document.getElementById(scenes[next].id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const toggleWish = (index: number) => {
    setLitWishes((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  const playMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.24;
    try {
      await audio.play();
    } catch {
      setIsMusicPlaying(false);
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await playMusic();
    } else {
      audio.pause();
    }
  };

  const startStory = () => {
    void playMusic();
    goToScene(1);
  };

  const currentJourney = journeys[journeyIndex];

  return (
    <>
      {/* Instrumental background music has no spoken dialogue to caption. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src="audio/well-be-okay.mp3"
        loop
        preload="metadata"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
      />

      <div
        className="reading-progress"
        style={{ width: `${((activeScene + 1) / scenes.length) * 100}%` }}
        aria-hidden="true"
      />

      <div className="scene-counter" aria-live="polite">
        <span>{String(activeScene + 1).padStart(2, "0")}</span>
        <i />
        <span>{String(scenes.length).padStart(2, "0")}</span>
      </div>

      <button
        type="button"
        className={`music-toggle ${isMusicPlaying ? "is-playing" : ""}`}
        aria-label={isMusicPlaying ? "暂停背景音乐" : "播放背景音乐"}
        aria-pressed={isMusicPlaying}
        onClick={() => void toggleMusic()}
      >
        <span className="music-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="music-title">We’ll Be Okay</span>
      </button>

      <nav className="scene-nav" aria-label="故事章节">
        {scenes.map((scene, index) => (
          <button
            type="button"
            key={scene.id}
            className={activeScene === index ? "is-active" : ""}
            aria-label={`前往${scene.label}`}
            aria-current={activeScene === index ? "step" : undefined}
            onClick={() => goToScene(index)}
          >
            <span />
          </button>
        ))}
      </nav>

      <main className="story-scroll" ref={storyRoot}>
        <section className={`scene hero ${activeScene === 0 ? "is-active" : ""}`} id="cover" data-scene="0">
          <div className="night-sky" aria-hidden="true" />
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />

          <div className="hero-content">
            <p className="eyebrow">七夕 · 写给妹妹的一封信</p>
            <h1>
              春天住进
              <span>星星里</span>
            </h1>
            <p className="hero-intro">
              宇宙有无数颗星星，而哥哥的春天，
              <br />
              从遇见春春开始。
            </p>

            <div className="portrait-orbit" aria-label="春春和星星">
              <figure className="portrait portrait-chunchun">
                <img src="images/chunchun.jpg" alt="春春的照片" fetchPriority="high" />
                <figcaption>春春 · 妹妹</figcaption>
              </figure>

              <div className="orbit-copy" aria-hidden="true">
                <span>2024.04.14</span>
                <i>♡</i>
                <span>FOREVER</span>
              </div>

              <figure className="portrait portrait-xingxing">
                <img src="images/xingxing.jpg" alt="星星的照片" fetchPriority="high" />
                <figcaption>星星 · 哥哥</figcaption>
              </figure>
            </div>

            <button className="story-button" type="button" onClick={startStory}>
              打开我们的故事
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        </section>

        <section className={`scene story-section ${activeScene === 1 ? "is-active" : ""}`} id="journey" data-scene="1">
          <div className="scene-inner story-layout">
            <header className="section-heading">
              <p className="eyebrow">CHAPTER 01 · 一起看世界</p>
              <h2>
                走过的每一站，
                <br />
                都让“我们”更具体
              </h2>
              <p>从山城的辣，到海边的风，再到异国的夜。</p>
            </header>

            <div className="journey-carousel">
              <div className="journey-topline">
                <span>我们的旅行地图</span>
                <span>{String(journeyIndex + 1).padStart(2, "0")} / {String(journeys.length).padStart(2, "0")}</span>
              </div>

              <article className="journey-card" key={`${currentJourney.date}-${currentJourney.place}`}>
                <img
                  className="journey-card-image"
                  src={currentJourney.image}
                  alt={currentJourney.imageAlt}
                  loading={journeyIndex === 0 ? "eager" : "lazy"}
                />
                <span className="journey-card-shade" aria-hidden="true" />
                <span className="journey-light-trail" aria-hidden="true" />
                <div className="journey-number" aria-hidden="true">
                  {String(journeyIndex + 1).padStart(2, "0")}
                </div>
                <time>{currentJourney.date}</time>
                <h3>{currentJourney.place}</h3>
                <p>{currentJourney.copy}</p>
              </article>

              <div className="journey-controls">
                <button
                  type="button"
                  aria-label="上一站"
                  disabled={journeyIndex === 0}
                  onClick={() => setJourneyIndex((index) => Math.max(0, index - 1))}
                >
                  ←
                </button>
                <div className="journey-dots" aria-label="旅行站点">
                  {journeys.map((journey, index) => (
                    <button
                      type="button"
                      key={`${journey.date}-dot`}
                      className={journeyIndex === index ? "is-active" : ""}
                      aria-label={`查看${journey.place}`}
                      aria-pressed={journeyIndex === index}
                      onClick={() => setJourneyIndex(index)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="下一站"
                  disabled={journeyIndex === journeys.length - 1}
                  onClick={() =>
                    setJourneyIndex((index) => Math.min(journeys.length - 1, index + 1))
                  }
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <button className="scene-next" type="button" onClick={() => goToScene(2)}>
            下一幕 · 生日那天 <span aria-hidden="true">↓</span>
          </button>
        </section>

        <section className={`scene memory-section ${activeScene === 2 ? "is-active" : ""}`} id="birthday" data-scene="2">
          <div className="memory-sparkles" aria-hidden="true">
            {sparkleStyles.map((style, index) => <span key={index} style={style}>✦</span>)}
          </div>
          <div className="scene-inner memory-layout">
            <div className="memory-copy">
              <p className="eyebrow">CHAPTER 02 · 三月十日</p>
              <h2>
                照片不必很多，
                <br />
                重要的是照片里的人
              </h2>
              <p>
                2025 年的天津，生日皇冠戴在妹妹头上。哥哥送出一份礼物，也悄悄许下一个愿望：希望以后你镜头里的风景，有很多都是我们一起见过的。
              </p>
            </div>

            <div className="photo-stack" aria-label="生日当天的两张合照">
              <figure className="polaroid polaroid-back">
                <img
                  src="images/birthday-together-1.jpg"
                  alt="春春和星星在生日当天的合照"
                  loading="lazy"
                />
                <figcaption>天津 · 2025.03.10</figcaption>
              </figure>
              <figure className="polaroid polaroid-front">
                <img
                  src="images/birthday-together-2.jpg"
                  alt="春春戴着生日皇冠和星星开心合照"
                  loading="lazy"
                />
                <figcaption>这一天，我们笑得很好看</figcaption>
              </figure>
            </div>
          </div>

          <button className="scene-next" type="button" onClick={() => goToScene(3)}>
            下一幕 · 再次相见 <span aria-hidden="true">↓</span>
          </button>
        </section>

        <section className={`scene reunion-section ${activeScene === 3 ? "is-active" : ""}`} id="reunion" data-scene="3">
          <div className="scene-inner reunion-inner">
            <div className="reunion-stars" aria-hidden="true">
              <span className="reunion-star reunion-star-left">春</span>
              <span className="reunion-line" />
              <span className="reunion-star reunion-star-right">星</span>
            </div>

            <div className="reunion-copy">
              <p className="eyebrow">CHAPTER 03 · 再次走向彼此</p>
              <h2>有些重逢，是故事重新开始发光。</h2>
              <div className="reunion-dates">
                <div>
                  <time>2026.05.01</time>
                  <span>我们再次见面</span>
                </div>
                <i aria-hidden="true">→</i>
                <div>
                  <time>2026.06.18</time>
                  <span>我们重新选择彼此</span>
                </div>
              </div>
              <blockquote>
                这一次，不是简单地回到从前，
                <br />
                而是更懂得珍惜以后。
              </blockquote>
            </div>
          </div>

          <button className="scene-next" type="button" onClick={() => goToScene(4)}>
            下一幕 · 我们的未来 <span aria-hidden="true">↓</span>
          </button>
        </section>

        <section className={`scene future-section ${activeScene === 4 ? "is-active" : ""}`} id="future" data-scene="4">
          <div className="future-constellation" aria-hidden="true" />
          <div className="scene-inner future-inner">
            <header className="section-heading future-heading">
              <p className="eyebrow">CHAPTER 04 · 下一站</p>
              <h2>想和你一起完成的未来</h2>
              <p>轻轻点亮每一个约定，让它们成为我们接下来的路标。</p>
            </header>

            <div className="wish-grid">
              {wishes.map((wish, index) => {
                const isLit = litWishes.includes(index);
                return (
                  <button
                    type="button"
                    className={`wish-card ${isLit ? "is-lit" : ""}`}
                    aria-pressed={isLit}
                    key={wish}
                    onClick={() => toggleWish(index)}
                  >
                    <span className="wish-star" aria-hidden="true">{isLit ? "★" : "☆"}</span>
                    <span>{wish}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button className="scene-next" type="button" onClick={() => goToScene(5)}>
            最后一幕 · 七夕祝福 <span aria-hidden="true">↓</span>
          </button>
        </section>

        <section className={`scene finale-section ${activeScene === 5 ? "is-active" : ""}`} id="blessing" data-scene="5">
          <div className="finale-stars" aria-hidden="true" />
          <div className="finale-aurora" aria-hidden="true" />
          <div className="finale-content">
            <p className="eyebrow">TO MY CHUNCHUN</p>
            <h2>
              <span>七夕快乐</span>
              <span>妹妹</span>
            </h2>

            {!letterOpen ? (
              <button
                type="button"
                className="letter-button"
                aria-expanded="false"
                aria-controls="letter"
                onClick={() => setLetterOpen(true)}
              >
                <span className="envelope" aria-hidden="true">♡</span>
                收下哥哥的七夕祝福
              </button>
            ) : (
              <article className="love-letter" id="letter" aria-live="polite">
                <button
                  type="button"
                  className="letter-close"
                  aria-label="收起情书"
                  onClick={() => setLetterOpen(false)}
                >
                  ×
                </button>
                <p className="letter-salutation">亲爱的春春：</p>
                <p>
                  遇见你之后，我不只开始期待每一个节日，也开始期待以后每一个普通的日子。
                </p>
                <p>
                  我们吃过山城的辣，吹过海边的风，也看过异国的夜。走过那么多地方后才发现，最想抵达的目的地，还是彼此身边。
                </p>
                <p>
                  希望未来的我们比现在更好，去更多地方，留下更多故事。这个七夕，以及以后许多个七夕，哥哥都想陪妹妹一起走下去。
                </p>
                <p className="letter-signature">
                  爱你的星星
                  <time>七夕</time>
                </p>
              </article>
            )}

            {letterOpen && (
              <div className="blessing-burst" aria-hidden="true">
                {heartStyles.map((style, index) => (
                  <span key={index} style={style}>♥</span>
                ))}
              </div>
            )}

            <footer>
              <span>春春</span>
              <i aria-hidden="true">♡</i>
              <span>星星</span>
              <small>2024.04.14 — ∞</small>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
