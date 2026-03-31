"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import UnlockAdventureSection from "@/components/UnlockAdventureSection";
import { useState, useEffect, use } from "react";

export default function Home({ params }) {
  const { locale } = use(params);
  const initialData = useDataContext();

  const [entry, setEntry] = useState(null);

  const getContent = async () => {
    const data = await ContentstackClient.getElementByTypeWithRefs(
      "homepage",
      locale,
      ['modular_blocks.unlock_adventure_section.reference',
        'modular_blocks.unlock_adventure_section.reference.vehicles.internal_url'
      ],
      // initialData
    );
    // console.log(data);

    setEntry(data[0]);
  };

  useEffect(() => {
    ContentstackClient.onEntryChange(() => {
      getContent();
    });
  }, []);

  return (
    <div>
       <div
        data-pageref={entry?.uid}
        data-contenttype="homepage"
        data-locale={locale}
      >
         <div
          className={
            entry?.modular_blocks?.length === 0
              ? "visual-builder__empty-block-parent"
              : ""
          }
          {...entry?.$?.modular_blocks}
        >
          {entry?.modular_blocks.map((block, index) => (
            <div key={index} {...entry?.$?.["modular_blocks__" + index]}>
              {block.hasOwnProperty("unlock_adventure_section") && (
                <UnlockAdventureSection key={index} content={block.unlock_adventure_section?.reference?.[0]} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
