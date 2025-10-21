
import { cache } from "react";
import { headers } from "next/headers";
import ContentstackServer from "@/lib/cstack";
import DataContextProvider from "@/context/data.context";

//uncomment this function
// const fetchData = cache(async (locale) => {
//   const headersList = await headers();
//   const variantParam = headersList.get('x-personalize-variants');
//   const data = await ContentstackServer.getElementByType("homepage", locale, {}, variantParam);
//   return data;
// });

//uncomment this function
// export const generateMetadata = async ({ params }) => {
//   const { locale } = await params;
//   const data = await fetchData(locale);
//   const entry = data[0];

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
  //const { locale } = await params;
  //const data = await fetchData(locale);
  
  // return (
  //       <DataContextProvider data={data}>
  //         {children}
  //       </DataContextProvider>
  // );
  //once connected to contentstack uncomment code above and delete the return below
  return (
    <div>
       {children}
    </div>
  )
}
