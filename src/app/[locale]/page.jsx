"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import { useState, useEffect, use } from "react";
import BlankComponent from "@/app/components/blankComponent";

export default function Home({ params }) {
  const { locale } = use(params);
  //const initialData = useDataContext();

  // states
  const [entry, setEntry] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await ContentstackClient.getElementByType("homepage", locale);
  //     setEntry(data[0]);
  //   }

  //   ContentstackClient.onEntryChange(fetchData);
  // }, [locale, initialData]);

  return (
    <div>
      <h1></h1>
      <p>Add or check BlankComponent to the front end here for instructions after connecting </p>
      <BlankComponent></BlankComponent>
    </div>
  );
}
