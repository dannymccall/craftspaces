"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const SlideShow = ({
  images,
  className = "aspect-[3/2]",
}: {
  images: string[];
  className?: string; // dynamic height/aspect class
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setNavHeight(nav.clientHeight);
  }, []);

  const handlePrev = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setFade(false);
    }, 300);
  };

  const handleNext = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setFade(false);
    }, 300);
  };

  const handleDotClick = (index: number) => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ marginTop: navHeight }}
    >
      <Image
        src={images[currentIndex]}
        alt="slideshow"
        fill
        className={`object-cover transition-opacity duration-500 ease-in-out ${
          fade ? "opacity-0" : "opacity-40"
        }`}
        priority
      />

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/60 hover:bg-white text-black rounded-full px-3 py-1 z-10"
      >
        ◀
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/60 hover:bg-white text-black rounded-full px-3 py-1 z-10"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideShow;
