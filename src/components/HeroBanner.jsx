"use client";

import { useState, useEffect } from "react";

export default function HeroBanner({ content = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = content?.length;
  const currentSlide = content?.[currentIndex] || {};
  const hasHeading = Boolean(currentSlide?.heading);
  const hasSubheading = Boolean(currentSlide?.sub_heading);
  const isButtonOnly = !hasHeading && !hasSubheading && currentSlide?.cta?.link_text;

  // Auto slide (optional - can remove if not needed)
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 8000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const getTextAlignment = () => {
    switch (currentSlide?.text_position) {
      case "Left":
        return "items-start text-left";
      case "Center":
        return "items-center text-center";
      case "Right":
      default:
        return "items-end text-right";
    }
  };

  const goToPrev = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="relative w-full h-[500px] lg:h-[700px] mb-[30px] overflow-hidden">
      {/* Background media: video first, image fallback */}
      {currentSlide?.background_video?.url ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={currentSlide.background_video.url} />
        </video>
      ) : currentSlide?.background_image?.url ? (
        <img
          src={currentSlide.background_image.url}
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}

      {/* Overlay (for readability like your image) */}
      {/* <div className="absolute inset-0 bg-black/30" /> */}

      {/* Content */}
      <div
        key={currentIndex}
        className={`hero-banner-content relative z-10 flex h-full flex-col px-15 py-15 md:px-20 md:py-20 pointer-events-none ${
          isButtonOnly ? "justify-end" : "justify-center"
        } ${getTextAlignment()}`}
      >
        {/* Heading */}
        {currentSlide?.heading && (
          <h1 className="pointer-events-auto max-w-2xl text-[45px] lg:text-[90px] leading-[41px] lg:leading-[85px] font-riftdemi text-white">
            {currentSlide?.heading}
          </h1>
        )}

        {/* Subheading */}
        {currentSlide?.sub_heading && (
          <p className="pointer-events-auto mt-4 max-w-xl text-lg text-white md:text-xl font-riftdemi">
            {currentSlide.sub_heading}
          </p>
        )}

        {/* CTA */}
        {currentSlide?.cta?.link_text && (
          <button
            type="button"
            className={`pointer-events-auto inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#c21300] bg-[#c21300] px-6 py-3 text-[1rem] font-riftdemi text-white
            ${isButtonOnly ? "mt-0" : "mt-6"}`}
          >
            {currentSlide.cta.link_text}
            <svg
              className="shrink-0"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Carousel arrows (only if more than 1 slide) */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goToPrev}
            className="pointer-events-auto absolute left-2 top-1/2 z-20 flex h-22 w-12 -translate-y-1/2 items-center justify-center bg-transparent text-white/35 transition-colors hover:bg-transparent hover:text-white focus:outline-none focus-visible:text-white md:left-4 md:h-26 md:w-14"
          >
            <svg
              className="h-full max-h-22 w-auto md:max-h-26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              preserveAspectRatio="xMidYMid meet"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goToNext}
            className="pointer-events-auto absolute right-2 top-1/2 z-20 flex h-22 w-12 -translate-y-1/2 items-center justify-center bg-transparent text-white/35 transition-colors hover:bg-transparent hover:text-white focus:outline-none focus-visible:text-white md:right-4 md:h-26 md:w-14"
          >
            <svg
              className="h-full max-h-22 w-auto md:max-h-26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              preserveAspectRatio="xMidYMid meet"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Navigation (ONLY if more than 1 slide) */}
      {totalSlides > 1 && (
        <div className="absolute bottom-0 mt-[55px] mb-[55px] ml-[10%] mr-[10%] h-[20px] w-[80%] overflow-hidden z-20 flex items-center justify-center gap-3">
          {content.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-[20px] w-[20px] cursor-pointer rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                index === currentIndex
                  ? "bg-red-600 scale-110"
                  : "bg-black/40 border border-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}