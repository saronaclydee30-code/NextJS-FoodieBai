"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AppIcon from "../components/shared/AppIcon";

const foodPhotos = [
  {
    src: "/welcome-food-1.webp",
    title: "A little taste of local",
    description: "Fresh flavors, made for sharing.",
    alt: "A table filled with fresh salads, grilled dishes, and Mediterranean favorites",
  },
  {
    src: "/welcome-food-2.webp",
    title: "Gather around something good",
    description: "Comfort food for your favorite people.",
    alt: "A festive table with a roasted turkey and a variety of side dishes",
  },
  {
    src: "/welcome-food-3.webp",
    title: "Make room for a treat",
    description: "Savory bites and something sweet.",
    alt: "A spread of burgers, fries, pastries, and desserts",
  },
  {
    src: "/welcome-food-4.webp",
    title: "A feast for every craving",
    description: "A little bit of everything, all in one place.",
    alt: "An assortment of burgers, wraps, pizza, fries, and desserts",
  },
  {
    src: "/welcome-food-5.webp",
    title: "Fresh picks, happy plates",
    description: "Find your next feel-good favorite.",
    alt: "A bright spread of fried chicken, sandwiches, vegetables, and sides",
  },
  {
    src: "/welcome-food-6.webp",
    title: "Good food starts fresh",
    description: "Fresh ingredients make every bite better.",
    alt: "Fresh salmon, chicken, berries, vegetables, and herbs arranged on a table",
  },
  {
    src: "/welcome-food-7.webp",
    title: "A little something for everyone",
    description: "Pizza, burgers, fries, and all your favorites.",
    alt: "A table covered with pizza, burgers, fries, sandwiches, and fried bites",
  },
  {
    src: "/welcome-food-8.webp",
    title: "Make every meal a moment",
    description: "Discover a new favorite to share.",
    alt: "A flat lay of assorted grilled dishes, vegetables, and sides",
  },
];

export default function WelcomeFoodDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const deckRef = useRef(null);
  const touchStartRef = useRef(null);
  const lastWheelChangeRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimerRef = useRef(null);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return undefined;

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const canMove = direction > 0
        ? activeIndex < foodPhotos.length - 1
        : activeIndex > 0;

      if (!canMove) return;

      event.preventDefault();
      wheelDeltaRef.current += event.deltaY;
      window.clearTimeout(wheelResetTimerRef.current);
      wheelResetTimerRef.current = window.setTimeout(() => {
        wheelDeltaRef.current = 0;
      }, 180);

      if (Math.abs(wheelDeltaRef.current) < 48) return;

      const now = Date.now();
      if (now - lastWheelChangeRef.current < 540) return;

      lastWheelChangeRef.current = now;
      wheelDeltaRef.current = 0;
      setActiveIndex((index) => index + direction);
    };

    deck.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      deck.removeEventListener("wheel", handleWheel);
      window.clearTimeout(wheelResetTimerRef.current);
    };
  }, [activeIndex]);

  const showPrevious = () => setActiveIndex((index) => Math.max(index - 1, 0));
  const showNext = () => setActiveIndex((index) => Math.min(index + 1, foodPhotos.length - 1));

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      showNext();
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(foodPhotos.length - 1);
    }
  };

  const handleTouchStart = (event) => {
    touchStartRef.current = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  };

  const handleTouchEnd = (event) => {
    if (!touchStartRef.current) return;

    const deltaX = event.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX < 0) showNext();
    else showPrevious();
  };

  return (
    <div
      ref={deckRef}
      className="hero-food-deck"
      role="region"
      aria-label="Food photo gallery"
      aria-roledescription="carousel"
      aria-describedby="hero-food-deck-hint"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-food-card-stack" aria-live="polite">
        {foodPhotos.map((photo, index) => {
          const offset = index - activeIndex;
          const stackOffset = offset * 0.75;
          const distance = Math.abs(offset);
          const active = index === activeIndex;

          return (
            <button
              className={`hero-food-card ${active ? "hero-food-card-active" : ""}`}
              key={photo.src}
              type="button"
              style={{
                "--card-x": `${stackOffset * 17}px`,
                "--card-y": `${distance * 5}px`,
                "--card-rotation": `${stackOffset * 2}deg`,
                "--card-scale": 1 - distance * 0.02,
                zIndex: foodPhotos.length - distance,
              }}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1} of ${foodPhotos.length}: ${photo.title}. ${photo.description}`}
              aria-pressed={active}
              aria-hidden={!active}
              tabIndex={active ? 0 : -1}
            >
              <Image
                className="hero-food-image"
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 800px) 78vw, 36vw"
                loading="eager"
                fetchPriority={index === 0 ? "high" : "low"}
              />
              <span className="hero-food-card-shade" aria-hidden="true" />
              <span className="hero-food-caption">
                <span className="hero-food-caption-dot" />
                <span className="hero-food-caption-copy">
                  <strong>{photo.title}</strong>
                  <small>{photo.description}</small>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="hero-food-deck-footer">
        <span className="hero-food-count" aria-live="polite">
          <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
          <span>/ {String(foodPhotos.length).padStart(2, "0")}</span>
        </span>
        <span id="hero-food-deck-hint" className="hero-food-deck-hint">
          Scroll or swipe to explore
        </span>
        <div className="hero-food-controls" aria-label="Food photos">
          <button type="button" onClick={showPrevious} disabled={activeIndex === 0} aria-label="Previous food photo">
            <AppIcon name="back" size={17} />
          </button>
          <button type="button" onClick={showNext} disabled={activeIndex === foodPhotos.length - 1} aria-label="Next food photo">
            <AppIcon name="chevronRight" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
