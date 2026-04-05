"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";

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

// Collects all column links from every menu_item so mega + secondary bar can render one combined list.
export function flattenSubNavMenuLinks(sub) {
  const items = sub?.menu_items || sub?.menu_item || [];
  return items.flatMap((mi) => mi?.links || mi?.link || []);
}

// Returns the URL path stored on a sub-nav link’s internal_link entry for route matching and active states.
function getSubNavLinkInternalPath(link) {
  const url = link?.internal_link?.[0]?.url;
  if (url == null ) return null;
  const t = url.trim();
  const clean = t.startsWith("/") ? t : `/${t}`;
  return clean;
}

// Compares slugParam to a sub-nav link’s internal path so the secondary bar can track the current page.
function slugParamMatchesSubNavLink(slugParam, link) {
  const internalPath = getSubNavLinkInternalPath(link);
  if (internalPath == null || slugParam == null) return false;
  const slugStr = Array.isArray(slugParam)
    ? slugParam.filter(Boolean).join("/")
    : String(slugParam).trim();
  if (!slugStr) return false;
  const pathNorm = internalPath.replace(/^\/+|\/+$/g, "");
  const slugNorm = slugStr.replace(/^\/+|\/+$/g, "");
  return slugNorm === pathNorm;
}

// True when the active route matches this sub-nav link (used for secondary bar visibility and link highlighting).
export function subNavLinkMatchesCurrentRoute(link, slugParam) {
  return (
    slugParamMatchesSubNavLink(slugParam, link)
  );
}

function getSecondaryNavLogoUrl(sub) {
  if (!sub) return null;
  const img = sub?.secondary_nav_logo;
  if (img?.url) return img.url;
  if (Array.isArray(img) && img[0]?.url) return img[0].url;
  return null;
}

function getSecondaryNavCta(sub) {
  if (!sub) return { text: null, link: null };
  return {
    text: sub?.secondary_nav_cta?.text,
    link: {
      internal_link: sub?.secondary_nav_cta?.internal_link
    },
  };
}

function secondaryNavLinkClass(active) {
  return `font-riftdemi pb-0.5 text-[15px] uppercase tracking-wide transition-colors ${
    active
      ? "border-b-1 border-isuzu-red text-white/40"
      : "text-white/85 hover:text-white hover:border-b-1 hover:border-isuzu-red"
  }`;
}

export default function SecondaryNavBar({ sub, slugParam, pathname }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const mobilePanelId = useId();
  const flatLinks = useMemo(() => flattenSubNavMenuLinks(sub), [sub]);
  const logoUrl = getSecondaryNavLogoUrl(sub);
  const cta = getSecondaryNavCta(sub);
  const logoLive =
    sub?.$?.secondary_nav_logo ||
    sub?.$?.secondary_navigation_logo ||
    sub?.$?.secondary_nav_logo_image ||
    {};

  const activeLink = useMemo(
    () => flatLinks.find((link) => subNavLinkMatchesCurrentRoute(link, slugParam)),
    [flatLinks, slugParam],
  );

  const collapsedLabel =
    activeLink?.link_text ||
    activeLink?.title ||
    activeLink?.text ||
    flatLinks[0]?.link_text ||
    "";

  useEffect(() => {
    setMobileExpanded(false);
  }, [pathname, slugParam]);

  return (
    <div
      className="border-t-2 border-isuzu-red bg-neutral-900 text-white"
      role="navigation"
      aria-label="Section"
    >
      {/* Below lg: collapsed row (active label + chevron only); tap expands links + CTA. */}
      <div className="lg:hidden">
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left font-riftdemi text-[15px] font-bold uppercase tracking-wide text-white"
          aria-expanded={mobileExpanded}
          aria-controls={mobilePanelId}
          onClick={() => setMobileExpanded((open) => !open)}
        >
          <svg
            className={`h-2.5 w-2.5 shrink-0 text-white transition-transform duration-200 ${
              mobileExpanded ? "rotate-180" : ""
            }`}
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
          <span className="min-w-0 flex-1 truncate">{collapsedLabel}</span>
        </button>
        {mobileExpanded ? (
          <div
            id={mobilePanelId}
            className="border-t border-white/10 px-4 pb-4 pt-3"
          >
            <ul className="flex flex-col gap-3">
              {flatLinks.map((link, idx) => {
                const href =
                  link?.internal_link?.[0]?.url || link?.external_link || "#";
                const active = subNavLinkMatchesCurrentRoute(link, slugParam);
                return (
                  <li key={link?.uid || idx} className="list-none">
                    <NavAnchor
                      link={href}
                      className={`block w-fit ${secondaryNavLinkClass(active)}`}
                      onClick={() => setMobileExpanded(false)}
                    >
                      {link?.link_text}
                    </NavAnchor>
                  </li>
                );
              })}
            </ul>
            {cta.text ? (
              <div className="mt-4 border-t border-white/10 pt-4">
                <NavAnchor
                  link={cta.internal_link?.[0]?.url || "#"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-isuzu-red px-5 py-2.5 font-riftdemi text-[15px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700"
                  onClick={() => setMobileExpanded(false)}
                >
                  {cta.text}
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-white"
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
                </NavAnchor>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* lg+: logo, full link row, CTA */}
      <div className="mx-auto hidden max-w-[1630px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:gap-x-6 sm:px-6 lg:flex lg:flex-nowrap lg:px-8 lg:py-3.5">
        <div className="flex shrink-0 items-center lg:w-[min(100%,200px)]">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              className="h-7 w-auto object-contain object-left sm:h-9"
              {...logoLive}
            />
          ) : null}
        </div>
        <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-5 lg:gap-x-6">
          {flatLinks.map((link, idx) => {
            const href =
              link?.internal_link?.[0]?.url || link?.external_link || "#";
            const active = subNavLinkMatchesCurrentRoute(link, slugParam);
            return (
              <li key={link?.uid || idx} className="list-none">
                <NavAnchor
                  link={href}
                  className={secondaryNavLinkClass(active)}
                >
                  {link?.link_text}
                </NavAnchor>
              </li>
            );
          })}
        </ul>
        <div className="flex w-full shrink-0 justify-center lg:w-auto lg:justify-end">
          {cta.text ? (
            <NavAnchor
              link={cta.internal_link?.[0]?.url || "#"}
              className="inline-flex items-center gap-2 rounded-full bg-isuzu-red px-5 py-2.5 font-riftdemi text-[15px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700"
            >
              {cta.text}
              <svg
                className="h-3.5 w-3.5 shrink-0 text-white"
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
            </NavAnchor>
          ) : null}
        </div>
      </div>
    </div>
  );
}
