"use client";

function getToolHref(item) {
  if (!item) return "";
  const url = item?.internal_url?.[0]?.url;
  return url || null;
}

function isFullWidthFlag(value) {
  if (value === true) return true;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "true" || v === "yes" || v === "1";
  }
  return false;
}

function resolveBackgroundHex(content) {
  const raw = content?.background_color?.hex;
  return raw || "#eee";
}

function BuyingToolItem({ item, index, count, barLayout, content, groupUid, fullWidth }) {
  const href = getToolHref(item);
  const iconUrl = item?.icon?.url || "";
  const IconWrapper = href ? "a" : "div";
  const label = item?.text || "";


  const borders = barLayout
    ? [
        index % 2 === 0 ? "max-md:border-r max-md:border-neutral-300/80" : "",
        index < 2 ? "max-md:border-b max-md:border-neutral-300/80 md:border-b-0" : "",
        index < count - 1 ? "md:border-r md:border-neutral-300/80" : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <IconWrapper
      href={href || "#"}
      className={`group flex flex-col items-center justify-center py-5 sm:py-6 cursor-pointer ${fullWidth ? "" : "hover:bg-black/10"} ${
        barLayout
          ? `px-3 sm:px-4 md:flex-1 ${borders}`
          : "px-5 sm:px-8 md:px-10"
      }`}
    >
      <div
        className={`mb-[16px] flex shrink-0 items-center justify-center group-hover:translate-y-[4px] transition-transform duration-300 ease-in-out ${fullWidth ? "h-[40px] w-[40px]" : "h-[48px] w-[48px]"} ${
          href ? "transition-opacity hover:opacity-90" : ""
        }`}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="max-h-full max-w-full object-contain"
            {...item?.$?.icon}
          />
        ) : (
          <span
            className="text-xs text-neutral-400"
            aria-hidden
          >
            Icon
          </span>
        )}
      </div>
      {label ? (
        <div className="flex w-full flex-col items-center">
          <span className="relative inline-block max-w-[140px] pb-1 text-center font-riftdemi text-lg uppercase leading-tight tracking-[0.08em] text-neutral-900 sm:max-w-none">
            <span {...item?.$?.text}>{label}</span>
            <span
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-isuzu-red transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100"
              aria-hidden
            />
          </span>
        </div>
      ) : null}
    </IconWrapper>
  );
}

export default function BuyingTools({ content }) {
  const items = Array.isArray(content?.icon_list)
    ? content.icon_list
    : Array.isArray(content?.icons)
      ? content.icons
      : [];
  const list = items.filter(Boolean);
  const groupUid = Array.isArray(content?.icon_list)
    ? "icon_list"
    : "icons";
  const fullWidth = isFullWidthFlag(
    content?.full_width ?? content?.fullWidth,
  );
  const backgroundColor = resolveBackgroundHex(content);

  if (list.length === 0) return null;

  return (
    <section
      className="w-full my-10"
      data-section="buying-tools"
    >
      <div
        className={`mx-auto w-full ${fullWidth ? "max-w-full py-10 sm:py-12 md:py-14" : "max-w-[1200px]"}`}
        style={{ backgroundColor }}
      >
        {fullWidth && content?.title ? (
          <header className="mb-8 text-center md:mb-10">
            <h2
              className="font-riftdemi text-[48px] uppercase text-neutral-900"
              {...(content?.$?.title || {})}
            >
              {content.title}
            </h2>
          </header>
        ) : null}

        <div
          className={
            fullWidth
              ? "flex flex-wrap items-start justify-center"
              : "grid max-md:grid-cols-2 md:flex md:flex-row md:items-stretch"
          }
          {...(content?.$?.[groupUid] || {})}
        >
          {list.map((item, index) => (
            <BuyingToolItem
              key={item._metadata?.uid ?? `tool-${index}`}
              item={item}
              index={index}
              count={list.length}
              barLayout={!fullWidth}
              content={content}
              groupUid={groupUid}
              fullWidth={fullWidth}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
