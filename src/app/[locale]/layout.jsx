// app/[locale]/layout.jsx
import { cache } from "react";
import { headers } from "next/headers";
import Script from "next/script";
import ContentstackServer from "@/lib/cstack";
import DataContextProvider from "@/context/data.context";

// ---- FONTS ----
import {
  Cinzel,
  Cormorant,
  Inter,
  Montserrat,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Raleway,
  Roboto,
  Rokkitt,
  Spectral,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100","200","300","400","500","600","700","800","900"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400","500","600","700","800","900"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100","300","400","500","700","900"],
});

const playfair_display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400","500","600","700","800","900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400","500","600","700","800","900"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["100","200","300","400","500","600","700","800","900"],
});

const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  weight: ["300","400","500","600","700","800"],
});

const spectral = Spectral({
  subsets: ["latin"],
  variable: "--font-spectral",
  weight: ["200","300","400","500","600","700","800"],
});

const rokkitt = Rokkitt({
  subsets: ["latin"],
  variable: "--font-rokkitt",
  weight: ["100","200","300","400","500","600","700","800","900"],
});

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300","400","500","600","700"],
});


// -------------------------------
// SERVER FETCH FOR CONFIG
// -------------------------------
const getConfig = cache(async () => {
  const res = await fetch(
    "https://cdn.contentstack.io/v3/content_types/config/entries",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.CONTENTSTACK_API_KEY,
        access_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
      },
      next: { revalidate: 60 }, // optional caching
    }
  );

  const json = await res.json();
  return json.entries?.[0] || {};
});

// -------------------------------
// FONT PICKER (SSR SAFE)
// -------------------------------
function fontPicker(fontName) {
  const map = {
    Poppins: "var(--font-poppins)",
    Cinzel: "var(--font-cinzel)",
    Roboto: "var(--font-roboto)",
    Playfair_Display: "var(--font-playfair)",
    Montserrat: "var(--font-montserrat)",
    Raleway: "var(--font-raleway)",
    Open_Sans: "var(--font-opensans)",
    Spectral: "var(--font-spectral)",
    Rokkitt: "var(--font-rokkitt)",
    Cormorant: "var(--font-cormorant)",
  };

  return map[fontName] || "inherit";
}


// -------------------------------
// METADATA (same API as before)
// -------------------------------
export async function generateMetadata({ params }) {
  const parameters = await params;
  const locale = parameters.locale

  const headersList = await headers();
  const variantParam = headersList.get("x-personalize-variants");

  const data = await ContentstackServer.getElementByType(
    "homepage",
    locale,
    {},
    variantParam
  );

  const entry = data?.[0];

  return {
    title: entry?.seo?.title,
    description: entry?.seo?.description,
    robots: {
      index: entry?.seo?.no_index || false,
      follow: entry?.seo?.no_follow || false,
    },
    openGraph: {
      title: entry?.seo?.og_meta_tags?.title,
      description: entry?.seo?.og_meta_tags?.description,
      images: entry?.seo?.og_meta_tags?.image,
    },
  };
}



// -------------------------------
// ROOT SSR LAYOUT (JSX VERSION)
// -------------------------------
export default async function RootLayout({ children, params }) {
  const parameters = await params;
  const locale = parameters.locale
  const config = await getConfig();

  const headerFont = fontPicker(config.header_font);
  const buttonFont = fontPicker(config.button_font);
  const paragraphFont = fontPicker(config.paragraph_font);

  return (
    <div lang={locale}>
      <Script
        src="https://kit.fontawesome.com/d480817398.js"
        crossOrigin="anonymous"
      />

      {/* Global dynamic font CSS */}
      <style>{`
        h1, h2, h3 {
          font-family: ${headerFont};
        }

        .button, button {
          font-family: ${buttonFont};
        }

        .font-paragraph {
          font-family: ${paragraphFont} !important;
        }
      `}</style>

      <div
        className={[
          inter.variable,
          poppins.variable,
          cinzel.variable,
          montserrat.variable,
          playfair_display.variable,
          roboto.variable,
          raleway.variable,
          open_sans.variable,
          spectral.variable,
          rokkitt.variable,
          cormorant.variable,
        ].join(" ")}
      >
        <DataContextProvider data={{ config }}>
          {children}
        </DataContextProvider>
      </div>
    </div>
  );
}
