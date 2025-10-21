import { Geist, Geist_Mono } from "next/font/google";
import { cache } from "react";
import { headers } from "next/headers";
import "./globals.css";
import ContentstackServer from "@/lib/cstack";
import { PersonalizeProvider } from "@/context/personalize.context";
import { LyticsTracking } from "@/context/lyticsTracking";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// don't uncomment this
// const fetchData = cache(async (locale) => {
//   const headersList = await headers();
//   const variantParam = headersList.get('x-personalize-variants');
//   const data = await ContentstackServer.getElementByType("homepage", locale, {}, variantParam);
//   return data;
// });

//don't uncomment this
// export const generateMetadata = async ({ params }) => {
//   const { locale } = await params;
//   const data = await fetchData(locale);
//   const entry = data[0][0];

//   return {
//     title: entry.seo.title,
//     description: entry.seo.description,
//     robots: {
//       index: entry.seo.no_index || false,
//       follow: entry.seo.no_follow || false,
//     },
//     openGraph: {
//       title: entry.seo.title || entry.title,
//       description: entry.seo.description || entry.description,
//       images: entry.seo.image,
//     },
//   }
// };

export default async function RootLayout({
  children,
  params,
}) {
  const { locale } = await params;
  //uncomment all components below once connected
  return (
    <html lang={locale}>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <PersonalizeProvider> */}
          {/* <LyticsTracking /> */}
          {children}
        {/* </PersonalizeProvider> */}
      </body>
    </html>
  );
}
