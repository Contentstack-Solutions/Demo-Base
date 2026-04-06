"use client";

function getCtaData(cta) {
  const item = Array.isArray(cta) ? cta[0] : cta;
  if (!item) return { label: "", href: "" };

  return {
    label: item.link_text || "",
    href: item.internal_link?.[0]?.url || item.external_link|| "#",
  };
}

function CtaLink({ cta, editableAttrs, textColor }) {
  const { label, href } = getCtaData(cta);

  if (!label) return null;

  return (
    <a
      href={href || "#"}
      className="group mt-7 inline-flex items-center gap-2 text-lg font-riftdemi uppercase tracking-[0.02em] transition-colors"
      style={{ color: textColor || "#ffffff" }}
    >
      <span className="relative inline-block pb-1">
        <span {...editableAttrs}>{label}</span>
        <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#c21300] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      </span>
        <svg
        className="shrink-0 text-[#c21300] h-6 w-6"
        viewBox="0 0 26 26"
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

function TextPanel({ content, backgroundColor, textColor, className = "", splitLayout = true }) {
  return (
    <div
      className={`relative z-1 flex h-full w-full flex-col justify-center ${className}`}
      style={{ backgroundColor: backgroundColor || "#f3f3f3" }}
    >
      <div className="max-w-full"
        style={{ color: textColor || "#ffffff" }}
      >
        {content?.heading ? (
          <h2
            className={`text-[34px] ${splitLayout ? "font-riftdemi" : "font-montserrat"} uppercase leading-none tracking-tight sm:text-[42px] lg:text-[50px]`}
            {...(content?.$?.heading || {})}
          >
            {content.heading}
          </h2>
        ) : null}

        {content?.content ? (
          <div
            className="mt-5 text-[14px] leading-7  sm:text-[15px] font-aktiv_grotesk"
            dangerouslySetInnerHTML={{ __html: content.content }}
            {...(content?.$?.content || {})}
          />
        ) : null}

        <CtaLink cta={content?.cta} editableAttrs={content?.cta?.$?.link_text || {}} textColor={textColor} />
      </div>
    </div>
  );
}

function SplitLayout({ content, textSide, backgroundColor, textColor, imageUrl }) {
  const textFirst = textSide === "left";
  const splitlayout = true ;

  return (
    <section className="mx-auto my-8 w-full max-w-[1630px] px-4 sm:px-6 lg:px-8">
      <div className="grid min-h-[260px] overflow-hidden bg-white md:min-h-[360px] md:grid-cols-2">
        {textFirst ? (
          <TextPanel content={content} backgroundColor={backgroundColor} textColor={textColor} className="p-[60px] lg:py-[100px] lg:px-[60px]" />
        ) : (
          <ImagePanel imageUrl={imageUrl} editableAttrs={content?.$?.image || {}} />
        )}

        {textFirst ? (
          <ImagePanel imageUrl={imageUrl} editableAttrs={content?.$?.image || {}} />
        ) : (
          <TextPanel
            content={content}
            backgroundColor={backgroundColor}
            textColor={textColor}
            className="items-start text-left p-[60px] lg:py-[100px] lg:px-[60px]"
            splitLayout={splitlayout}
          />
        )}
      </div>
    </section>
  );
}

function ImagePanel({ imageUrl, editableAttrs }) {
  return imageUrl ? (
    <img
      src={imageUrl}
      alt=""
      className="h-full min-h-[260px] w-full object-cover md:min-h-[360px]"
      {...editableAttrs}
    />
  ) : (
    <div
      className="flex min-h-[260px] items-center justify-center bg-neutral-200 text-sm text-neutral-500 md:min-h-[360px]"
      {...editableAttrs}
    >
      Image
    </div>
  );
}

function OverlayLayout({ content, backgroundColor, textColor, imageUrl }) {
  const splitlayout = false ;
  return (
    <section className="mx-auto my-8 w-full max-w-[1630px] px-4 sm:px-6 lg:px-8">
      <div className="relative min-h-[340px] overflow-hidden md:min-h-[500px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            {...(content?.$?.image || {})}
          />
        ) : (
          <div
            className="absolute inset-0 bg-neutral-300"
            {...(content?.$?.image || {})}
          />
        )}

        <div className="relative flex h-full min-h-[340px] items-center my-[64px] md:min-h-[500px]">
          <TextPanel
            content={content}
            backgroundColor={backgroundColor}
            textColor={textColor}
            className="min-w-[40%] w-min shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-[48px] lg:py-[80px] lg:px-[64px]"
            splitLayout={splitlayout}
          />
        </div>
      </div>
    </section>
  );
}

export default function TextAndImage({ content }) {
  const layoutValue = String(content?.layout || "split").trim().toLowerCase();
  const layout =
    layoutValue === "text-overlay" || layoutValue === "overlay"
      ? "overlay"
      : "split";
  const textAlignValue = String(content?.text_align || "left")
    .trim()
    .toLowerCase();
  const textSide = textAlignValue === "right" ? "right" : "left";
  const backgroundColor = content?.background_color?.hex;
  const textColor = content?.text_color?.hex;
  const imageUrl = content?.image?.url || "";

  if (layout === "overlay") {
    return (
      <OverlayLayout
        content={content}
        backgroundColor={backgroundColor}
        textColor={textColor}
        imageUrl={imageUrl}
      />
    );
  }

  return (
    <SplitLayout
      content={content}
      textSide={textSide}
      backgroundColor={backgroundColor}
      textColor={textColor}
      imageUrl={imageUrl}
    />
  );
}
