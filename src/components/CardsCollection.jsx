"use client";

import { useEffect, useMemo, useState } from "react";

function getStartIndexes(totalCards, visibleCount, step) {
  if (totalCards <= visibleCount) return [0];

  const indexes = [];
  const maxStart = totalCards - visibleCount;

  for (let index = 0; index <= maxStart; index += step) {
    indexes.push(index);
  }

  if (indexes[indexes.length - 1] !== maxStart) {
    indexes.push(maxStart);
  }

  return indexes;
}

function getCtaData(cta) {
  const item = Array.isArray(cta) ? cta[0] : cta;
  if (!item) return { label: "", href: "#" };

  return {
    label: item.link_text || item.title || item.text || item.label || "",
    href:
      item.external_link ||
      "#",
  };
}

function CarouselArrow({ direction, onClick }) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      aria-label={isPrev ? "Previous cards" : "Next cards"}
      onClick={onClick}
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200/95 text-white transition hover:bg-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
        isPrev ? "left-0" : "right-0"
      }`}
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {isPrev ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

function CollectionCta({ cta, editableAttrs, compact = false }) {
  const { label, href } = getCtaData(cta);

  if (!label) return null;

  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 font-semibold uppercase tracking-[0.02em] text-neutral-900 transition-colors hover:text-[#c21300] ${
        compact ? "shrink-0 text-[11px] md:text-sm" : "mt-6 text-lg"
      }`}
    >
      <span className="relative inline-block pb-1">
        <span {...editableAttrs}>{label}</span>
        <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      </span>
      <svg
        className="h-6 w-6 shrink-0 text-[#c21300]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </a>
  );
}

function CollectionCard({ card, gridType }) {
  const imageUrl = card?.image?.url || "";
  const ctaAttrs = card?.link?.$?.link_text || {};
  const isTwoByTwo = gridType === "2x2";
  return (
    <article
      className="flex h-full flex-col overflow-hidden bg-white"
    >
      <div
        className={`relative w-full overflow-hidden bg-neutral-200 ${
          isTwoByTwo ? "aspect-[1.82/1]" : "aspect-[1.33/1]"
        }`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className={`h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.01] ${
              isTwoByTwo ? "object-center" : ""
            }`}
            {...card?.$?.image}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm text-neutral-500"
            {...card?.$?.image}
          >
            Image
          </div>
        )}
      </div>

      <div
        className={`flex ${
          isTwoByTwo
            ? ` ${card?.description ? "min-h-[138px] md:min-h-[146px]" : ""} items-start justify-between gap-4 bg-[#eee] px-5 py-3  md:px-6 md:py-6`
            : "flex-1 flex-col justify-between px-5 py-4 md:px-6 md:py-5"
        }`}
      >
        <div className={isTwoByTwo ? "min-w-0 flex-1" : ""}>
          {card?.heading ? (
            <h3
              className={`font-black uppercase leading-tight text-neutral-900 ${
                isTwoByTwo
                  ? `mb-2 line-clamp-2 ${card?.description ? "min-h-[48px] md:min-h-[52px]" : ""} text-[18px] md:text-[20px]`
                  : "mb-[24px] text-[18px] md:text-[20px]"
              }`}
              {...card?.$?.heading}
            >
              {card.heading}
            </h3>
          ) : null}

          {card?.description ? (
            <div
              className={`text-[14px] leading-6 text-neutral-700 ${
                isTwoByTwo ? "line-clamp-2" : "mb-[24px]"
              }`}
              dangerouslySetInnerHTML={{ __html: card.description }}
              {...card?.$?.description}
            />
          ) : null}
        </div>

        <CollectionCta
          cta={card?.cta_button || card?.link}
          editableAttrs={ctaAttrs}
          compact={isTwoByTwo}
        />
      </div>
    </article>
  );
}

export default function CardsCollection({ content }) {
  const gridValue = String(content?.grid || "4x1").trim().toLowerCase();
  const gridType = gridValue === "2x2" ? "2x2" : "4x1";
  const cards = Array.isArray(content?.cards) ? content.cards.filter(Boolean) : [];
  const cardsPerPage = 4;
  const stepSize = 2;
  const startIndexes = useMemo(
    () => getStartIndexes(cards.length, cardsPerPage, stepSize),
    [cards.length],
  );
  const [stepIndex, setStepIndex] = useState(0);
  // const [slideDirection, setSlideDirection] = useState("next");

  useEffect(() => {
    setStepIndex((current) => Math.min(current, startIndexes.length - 1));
  }, [startIndexes]);

  const visibleCards = useMemo(() => {
    const start = startIndexes[stepIndex] ?? 0;
    return cards.slice(start, start + cardsPerPage);
  }, [cards, startIndexes, stepIndex]);

  const showArrows = cards.length > cardsPerPage;

  const gridClass =
    gridType === "2x2"
      ? "grid-cols-1 gap-6 sm:grid-cols-2"
      : "grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 px-[40px]";
  const sectionMaxWidth =
    gridType === "2x2" ? "max-w-[1630px]" : "max-w-[1550px]";

  return (
    <section className={`mx-auto my-10 w-full px-4 sm:px-6 lg:px-8 ${sectionMaxWidth}`}>
      {content?.title ? (
        <header className="mb-8 text-center md:mb-10">
          <h2
            className="text-[34px] font-bold uppercase leading-none tracking-tight text-neutral-900 md:text-[46px]"
            {...(content?.$?.title || {})}
          >
            {content.title}
          </h2>
        </header>
      ) : null}

      <div className="relative">
        {showArrows ? (
          <>
            <CarouselArrow
              direction="prev"
              onClick={() => {
                // setSlideDirection("prev");
                setStepIndex((current) =>
                  current === 0 ? startIndexes.length - 1 : current - 1,
                );
              }}
            />
            <CarouselArrow
              direction="next"
              onClick={() => {
                // setSlideDirection("next");
                setStepIndex((current) =>
                  current === startIndexes.length - 1 ? 0 : current + 1,
                );
              }}
            />
          </>
        ) : null}

        <div
          key={`${startIndexes[stepIndex] ?? 0}`}
          className={`grid ${gridClass}`}
          {...(content?.$?.cards || {})}
        >
          {visibleCards.map((card, index) => (
            <CollectionCard
              key={index}
              card={card}
              gridType={gridType}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
