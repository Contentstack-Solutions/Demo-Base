"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import UnlockAdventureSection from "@/components/UnlockAdventureSection";
import PreviewVehicle from "@/components/PreviewVehicle";
import HeroBanner from "@/components/HeroBanner";
import { useState, useEffect, use } from "react";
import TextAndImage from "@/components/TextAndImage";
import CardsCollection from "@/components/CardsCollection";

export default function Home({ params }) {
  const { locale } = use(params);
  const initialData = useDataContext();
  const pageUrl = use(params).slug?.length > 0 ? "/"+use(params).slug.join('/') : null;

  const [entry, setEntry] = useState(null);

  const getContent = async () => {
    const data = await ContentstackClient.getElementByUrlWithRefs(
      "landing_pages",
      pageUrl, locale, 
      [
        'hero_banner',
        'modular_blocks.unlock_adventure_section.reference',
        'modular_blocks.unlock_adventure_section.reference.vehicles.internal_url',
        'modular_blocks.preview_vehicle.vehicle_preview_reference',
        'modular_blocks.preview_vehicle.vehicle_preview_reference.vehicle_models',
        'modular_blocks.preview_vehicle.vehicle_preview_reference.link.internal_link'
      ],
      // initialData
    )

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
        data-contenttype="landing_pages"
        data-locale={locale}
      >
      <HeroBanner
        content={entry?.hero_banner ?? []}
      />
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
              {block.hasOwnProperty("preview_vehicle") && (
                <PreviewVehicle key={index} content={block.preview_vehicle?.vehicle_preview_reference?.[0]} />
              )}
              {block.hasOwnProperty("text_and_image") && (
                <TextAndImage
                  key={index}
                  content={block.text_and_image}
                />
              )}
              {block.hasOwnProperty("card_collection") && (
                <CardsCollection
                  key={index}
                  content={block.card_collection}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

