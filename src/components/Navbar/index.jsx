"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import SecondaryNavBar, { flattenSubNavMenuLinks, subNavLinkMatchesCurrentRoute} from "./SecondaryNavBar";

function getSubNavEntry(item) {
  const ref = item?.sub_nav;
  if (!ref) return null;
  return Array.isArray(ref) ? ref[0] : ref;
}

function showSecondaryNavBar(sub) {
  if (!sub) return false;
  const v = sub?.show_secondary_navigation_bar;
  if (v === true || v === "true") return true;
  return Boolean(v);
}

// Decides if a top-level item should show a chevron and mega/accordion (any columns, images, or tiles in sub_nav).
function hasSubNavigation(item) {
  const sub = getSubNavEntry(item);
  if (!sub) return false;
  const items = sub.menu_items || sub.menu_item || [];
  const hasMenuItems =
    Array.isArray(items) &&
    items.length > 0 &&
    Boolean(
      items[0] &&
        (items[0].title ||
          items[0].links?.length ||
          items[0].image?.url ||
          items[0].tiles?.length > 0),
    );
  const anyItemImage = Array.isArray(items) && items.some((mi) => mi?.image?.url);
  const anyItemTiles =
    Array.isArray(items) &&
    items.some((mi) => mi?.tiles?.length > 0);
  return hasMenuItems || anyItemImage || anyItemTiles;
}

// Finds which sub_nav (if any) should drive the secondary bar when the current slug matches one of its links.
function findSecondaryNavContext(menu, slugParam) {
  if (!Array.isArray(menu)) return null;
  for (let i = 0; i < menu.length; i++) {
    const item = menu[i];
    if (!hasSubNavigation(item)) continue;
    const sub = getSubNavEntry(item);
    if (!sub || !showSecondaryNavBar(sub)) continue;
    const links = flattenSubNavMenuLinks(sub);
    for (const link of links) {
      if (subNavLinkMatchesCurrentRoute(link, slugParam)) {
        return { sub };
      }
    }
  }
  return null;
}

// Renders either next/link or a plain <a> so menu URLs work for internal paths and absolute external URLs.
function NavAnchor({ link, className, children, ...rest }) {
  const href = link;
  const external = /^https?:\/\//i.test(String(href).trim());

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

function Chevron({ open, active }) {
  return (
    <svg
      className={`h-2.5 w-2.5 shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      } ${active ? "text-isuzu-red" : "text-neutral-400"}`}
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightMobile({ expanded }) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 text-neutral-400 transition-transform duration-200 ${
        expanded ? "rotate-90" : ""
      }`}
      viewBox="0 0 8 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M1.5 1L6.5 6L1.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function subNavMegaFlexClass(count, plainMobile) {
  if (plainMobile) {
    return "flex flex-col gap-8";
  }
  if (count <= 1) {
    return "flex flex-col items-center gap-10 md:gap-12 lg:gap-16";
  }
  if (count === 2 || count === 3) {
    return "flex flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16";
  }
  if (count === 4 || count === 5) {
    return "flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-10 sm:gap-y-10 lg:flex-nowrap lg:gap-12";
  }
  return "flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-10 sm:gap-y-10 xl:flex-nowrap xl:gap-12 xl:gap-16";
}

function subNavMegaItemFlexClass(count, plainMobile) {
  if (plainMobile) return "w-full min-w-0";
  if (count <= 1) return "w-full max-w-3xl";
  if (count === 2 || count === 3) {
    return "w-full min-w-0 md:flex-1 md:basis-0";
  }
  if (count === 4 || count === 5) {
    return "w-full min-w-0 sm:flex-1 sm:basis-1/2 lg:basis-0 lg:flex-1";
  }
  return "w-full min-w-0 sm:flex-1 sm:basis-1/2 md:basis-1/3 xl:basis-0 xl:flex-1";
}

function SubNavMegaItem({ item, locale, count, plainMobile, onMegaLinkClick }) {
  const iconUrl = plainMobile ? null : item?.icon?.url;
  const title = item?.title;
  const links = item?.links || item?.link || [];
  const imageUrl = plainMobile ? null : item?.image?.url;
  const tiles = item?.tiles || item?.tile || [];
  const centerTextOnlyColumn = !imageUrl;

  const titleClass = plainMobile
    ? "font-riftdemi text-sm uppercase tracking-wide text-neutral-900"
    : count === 1
      ? "font-riftdemi font-bold text-[18px] md:text-5xl uppercase tracking-wide text-neutral-900"
      : "font-riftdemi font-bold text-[18px] md:text-5xl uppercase tracking-wide text-neutral-900";

  const linkClass = plainMobile
    ? "font-riftdemi text-[16px] uppercase tracking-wide text-neutral-900 transition-colors group-hover:text-isuzu-red"
    : "font-riftdemi text-[18px] uppercase tracking-wide text-neutral-900 transition-colors group-hover:text-isuzu-red";

  const textColumn = (
    <div
      className={`flex min-w-0 ${iconUrl ? "gap-4" : ""} ${
        imageUrl ? "w-full md:max-w-[min(100%,280px)] md:shrink-0" : "w-full"
      } ${
        centerTextOnlyColumn
          ? "items-start justify-center"
          : ""
      } sub-nav-mega-item__text-icon-container`}
    >
      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconUrl}
          alt=""
          className="mt-1 h-10 w-10 shrink-0 object-contain opacity-60"
          {...(item?.$?.icon || {})}
        />
      ) : null}
      <div
        className={
          centerTextOnlyColumn ? "min-w-0 shrink-0" : "min-w-0 flex-1"
        }
      >
        {title ? <h3 className={titleClass} {...(item?.$?.title || {})}>{title}</h3> : null}
        <ul
          className={
            plainMobile
              ? `space-y-2${title ? " mt-2" : ""}`
              : `space-y-2 sm:space-y-3${title ? " mt-4" : ""}`
          }
        >
          {links.map((link, idx) => (
            <li key={link?.uid || idx}>
              <NavAnchor
                link={link?.internal_link?.[0]?.url || link?.external_link || '#'}
                className={`group inline-block w-fit max-w-full ${linkClass}`}
                onClick={() => onMegaLinkClick?.()}
              >
                <span className="relative inline-block pb-1" {...(link?.$?.link_text || {})}>
                  {link?.link_text}
                  <span
                    className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-isuzu-red transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    aria-hidden
                  />
                </span>
              </NavAnchor>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const imageBlock = imageUrl ? (
    <div className="hidden min-w-0 flex-1 justify-center md:flex md:justify-start">
      <div className="sub-nav-mega-item__image w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="mx-auto block h-auto w-full object-cover object-center md:ml-0 md:mr-0"
          {...(item?.$?.image || {})}
        />
      </div>
    </div>
  ) : null;

  return (
    <div
      className={`flex min-w-0 flex-col gap-6 ${subNavMegaItemFlexClass(count, plainMobile)}`}
    >
      {imageUrl ? (
        <div className="flex w-full min-w-0 flex-col md:flex-row md:items-center md:justify-between">
          {textColumn}
          {imageBlock}
        </div>
      ) : (
        textColumn
      )}
      {tiles.length > 0 ? (
        <div
          className={
            plainMobile
              ? "flex flex-col gap-2 border-t border-neutral-200 pt-4"
              : "flex flex-row flex-wrap justify-center gap-x-6 gap-y-4 border-t border-neutral-200 pt-6 sm:pt-8"
          }
        >
          {tiles.map((tile, idx) => {
            const tIcon = tile?.icon?.url;
            const label = tile?.text;
            const href = tile?.internal_url?.[0]?.url || '#';
            return (
              <a
                key={tile?.uid || idx}
                href={href}
                className={
                  plainMobile
                    ? "group flex items-center gap-3 py-2 text-neutral-900 transition-colors group-hover:text-isuzu-red"
                    : "group flex min-w-0 shrink-0 basis-1/2 items-center gap-3 text-neutral-900 transition-colors group-hover:text-isuzu-red md:basis-1/4"
                }
              >
                {tIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tIcon}
                    alt=""
                    className="h-8 w-8 shrink-0 object-contain opacity-80 group-hover:opacity-100"
                    style={{ filter: "none" }}
                    {...(tile?.$?.icon || {})}
                  />
                ) : (
                  <span className="h-8 w-8 shrink-0 rounded border border-isuzu-red"/>
                )}
                <span className="relative inline-block min-w-0 pb-1 font-riftdemi text-[16px] uppercase leading-tight tracking-wide md:text-[18px]" {...(tile?.$?.text || {})}>
                  {label}
                  <span
                    className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-isuzu-red transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    aria-hidden
                  />
                </span>
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SubNavMega({sub, locale, panelId, plainMobile = false, onSubNavLinkActivate}) {
  const menuItems = sub?.menu_items || sub?.menu_item || [];
  const count = menuItems.length;
  const flexClass = subNavMegaFlexClass(count, plainMobile);
  const megaLinkClick =
    typeof onSubNavLinkActivate === "function"
      ? () => onSubNavLinkActivate()
      : undefined;

  return (
    <div
      id={panelId}
      role="region"
      className={
        plainMobile
          ? "bg-neutral-50"
          : "border-t border-neutral-200 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
      }
    >
      <div
        className={
          plainMobile
            ? "px-4 py-2"
            : "mx-auto max-w-[1630px] h-auto min-h-[490px] px-6 py-10 sm:px-8 lg:px-10"
        }
      >
        <div className={flexClass}>
          {menuItems.map((item, idx) => (
            <SubNavMegaItem
              key={item?.uid || idx}
              item={item}
              locale={locale}
              count={count}
              plainMobile={plainMobile}
              onMegaLinkClick={megaLinkClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar({ navigation }) {
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale || "en";
  const slugParam = params?.slug;
  const baseId = useId();
  const headerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSubIndex, setMobileSubIndex] = useState(null);

  // Runs when a user follows a link inside the mega / mobile sub-nav so overlays close after navigation.
  const handleSubNavLinkActivate = useCallback(() => {
    setOpenIndex(null);
    setMobileNavOpen(false);
    setMobileSubIndex(null);
  }, []);

  // Collapses primary mega, mobile drawer, and accordions (route change, Escape, click outside header).
  const closeMenus = useCallback(() => {
    setOpenIndex(null);
    setMobileNavOpen(false);
    setMobileSubIndex(null);
  }, []);

  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const getContent = async () => {
      const data = await ContentstackClient.getElementByTypeWithRefs(
        "navigation",
        locale,
        [ 'menu.sub_nav', 'menu.internal_link', 'menu.sub_nav.menu_items.links.internal_link', 'menu.sub_nav.secondary_nav_cta.internal_link', 'menu.sub_nav.menu_items.tiles.internal_url', 'cta.internal_link'],
      );
  
      setEntry(data[0]);
    };
    getContent();
    ContentstackClient.onEntryChange(() => {getContent()});
  }, [locale]);

  useEffect(() => {
    closeMenus();
  }, [pathname, closeMenus]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeMenus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenus]);

  useEffect(() => {
    function onPointerDown(e) {
      if (!headerRef.current?.contains(e.target)) closeMenus();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [closeMenus]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (mobileNavOpen) setOpenIndex(null);
  }, [mobileNavOpen]);


  const menu = useMemo(() => (Array.isArray(entry?.menu) ? entry?.menu : [entry?.menu]), [entry?.menu]);
  const secondaryNavContext = useMemo(
    () => findSecondaryNavContext(menu, slugParam),
    [menu, slugParam],
  );
  const logoUrl = entry?.logo?.url;
  const cta = entry?.cta;
  const ctaItem = Array.isArray(cta) ? cta[0] : cta;
  const ctaLabel =
    ctaItem?.link_text || "Find a dealer";

  const ctaLink = ctaItem?.internal_link?.[0]?.url || ctaItem?.external_link || '#'

  if (!entry) return null;

  const desktopSubNavOpen =
    openIndex !== null &&
    Boolean(menu[openIndex] && hasSubNavigation(menu[openIndex]));
  const mobileSubNavOpen = mobileSubIndex !== null;

  const showSecondaryNavUi =
    secondaryNavContext &&
    showSecondaryNavBar(secondaryNavContext.sub) &&
    flattenSubNavMenuLinks(secondaryNavContext.sub).length > 0 &&
    !desktopSubNavOpen &&
    !mobileSubNavOpen;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white"
    >
      <nav
        className="mx-auto flex max-w-[1630px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:justify-start lg:gap-4 lg:px-8 lg:py-4"
        aria-label="Primary"
      >
        <div className="flex shrink-0 items-center">
          {logoUrl ? (
            <Link href={`/`} className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Isuzu UTE"
                className="h-9 w-auto sm:h-10"
                {...(entry?.$?.logo || {})}
              />
            </Link>
          ) : (
            <Link
              href={`/`}
              className="font-riftbold text-xl font-bold uppercase text-isuzu-red"
            >
              Isuzu UTE
            </Link>
          )}
        </div>

        <ul className="hidden min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-2 lg:flex lg:gap-x-7 lg:px-4">
          {menu.map((item, index) => {
            const expandable = hasSubNavigation(item);
            const open = openIndex === index;
            const title = item?.title;
            const topHref = item?.internal_link[0]?.url || item?.external_link || '#';
            const panelId = `${baseId}-panel-${index}`;

            return (
              <li key={item?.uid || index} className="relative list-none">
                {expandable ? (
                  <button
                    type="button"
                    className={`flex items-center gap-1 border-b-2 border-transparent pb-0.5 font-riftdemi text-[16px] uppercase tracking-wide transition-colors ${
                      open ? "text-isuzu-red" : "text-neutral-900 hover:text-neutral-600"
                    } ${open ? "border-isuzu-red" : ""}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenIndex((v) => (v === index ? null : index))
                    }
                    {...(item?.$?.title || {})}
                  >
                    {title}
                    <Chevron open={open} active={open} />
                  </button>
                ) : (
                  <NavAnchor
                    link={topHref}
                    className="flex items-center gap-1 border-b-2 border-transparent pb-0.5 font-riftdemi text-[16px] uppercase tracking-wide text-neutral-900 transition-colors hover:text-neutral-600"
                  >
                    <span {...(item?.$?.title || {})}>{title}</span>
                  </NavAnchor>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-4">
          <NavAnchor
            link={ctaLink}
            className="flex items-center gap-2 font-riftdemi text-[16px] uppercase tracking-wide text-neutral-900 transition-colors hover:text-isuzu-red"
          >
            <svg
              className="h-6 w-6 shrink-0 text-isuzu-red"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="max-w-36 truncate sm:max-w-none" {...ctaItem?.$?.link_text}>{ctaLabel}</span>
          </NavAnchor>
          <button
            type="button"
            className="flex items-center gap-2 font-riftdemi text-[11px] uppercase tracking-wide text-neutral-900 lg:hidden"
            aria-expanded={mobileNavOpen}
            aria-controls={`${baseId}-mobile-panel`}
            onClick={() => {
              setMobileNavOpen((open) => {
                const next = !open;
                if (!next) setMobileSubIndex(null);
                return next;
              });
            }}
          >
            {mobileNavOpen ? (
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span className="font-bold">MENU</span>
          </button>
        </div>
      </nav>

      {showSecondaryNavUi ? (
        <SecondaryNavBar
          sub={secondaryNavContext.sub}
          slugParam={slugParam}
          pathname={pathname}
        />
      ) : null}

      {openIndex !== null && menu[openIndex] && hasSubNavigation(menu[openIndex]) ? (
        <div className="hidden lg:block">
          <SubNavMega
            sub={getSubNavEntry(menu[openIndex])}
            locale={locale}
            panelId={`${baseId}-panel-${openIndex}`}
            onSubNavLinkActivate={handleSubNavLinkActivate}
          />
        </div>
      ) : null}

      {mobileNavOpen ? (
        <div
          id={`${baseId}-mobile-panel`}
          className="absolute left-0 right-0 top-full z-40 max-h-[min(calc(100dvh-3.5rem),100vh)] overflow-y-auto border-t border-neutral-200 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)] lg:hidden"
        >
          <ul className="divide-y divide-neutral-200">
            {menu.map((item, index) => {
              const expandable = hasSubNavigation(item);
              const title = item?.title;
              const topHref = item?.internal_link[0]?.url || item?.external_link || '#';
              const subOpen = mobileSubIndex === index;
              const mobilePanelId = `${baseId}-mobile-sub-${index}`;

              return (
                <li key={item?.uid || index} className="list-none">
                  {expandable ? (
                    <>
                      <button
                        type="button"
                        className={`flex w-full items-center justify-between px-4 py-4 text-left font-riftdemi text-sm uppercase tracking-wide transition-colors sm:px-6 sm:text-base ${
                          subOpen ? "bg-neutral-50 text-isuzu-red" : "text-neutral-900"
                        }`}
                        aria-expanded={subOpen}
                        aria-controls={mobilePanelId}
                        onClick={() =>
                          setMobileSubIndex((v) => (v === index ? null : index))
                        }
                        {...(item?.$?.title || {})}
                      >
                        {title}
                        <ChevronRightMobile expanded={subOpen} />
                      </button>
                      {subOpen ? (
                        <div className="border-t border-neutral-200">
                          <SubNavMega
                            sub={getSubNavEntry(item)}
                            locale={locale}
                            panelId={mobilePanelId}
                            plainMobile
                            onSubNavLinkActivate={handleSubNavLinkActivate}
                          />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <NavAnchor
                      link={topHref}
                      className="flex w-full items-center px-4 py-4 font-riftdemi text-sm uppercase tracking-wide text-neutral-900 transition-colors hover:bg-neutral-50 sm:px-6 sm:text-base"
                      onClick={() => closeMenus()}
                    >
                      <span {...(item?.$?.title || {})}>{title}</span>
                    </NavAnchor>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </header>
  );
}