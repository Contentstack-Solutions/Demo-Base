"use client";
import { useState, useEffect } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import Cards from "@/components/cards";
import Footer from "@/components/footer";
import HalfSquares from "@/components/halfSquares";
import Hero from "@/components/hero";
import ImageGrid from "@/components/imageGrid";
import Reviews from "@/components/reviews";
import TextBlock from "@/components/textBlock";
import ProductFeature from "@/components/productFeature";
import Tabs from "@/components/tabs";
import Marquee from "@/components/marquee";
import LeadCapture from "@/components/leadCapture";
import { createClient } from '@/utils/supabase/client'
import CategoryBanner from "@/components/categoryBanner";
import Agent from "@/components/agent";
import RecommendationsBanner from "@/components/recommendationsBanner";
import { useParams } from "next/navigation";

export default function Home({ }) {
  const [entry, setEntry] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const supabase = createClient();
  const params = useParams();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

  const getContent = async () => {
    const entry = await ContentstackClient.getElementByTypeWithRefs(
      "homepage",
      params.locale,
      [
        'modular_blocks.review.reference', 
        'modular_blocks.image_grid.image.page', 
        'hero.hero_banner', 
        'hero.page', 
        'modular_blocks.review.testimonials', 
        'modular_blocks.review.testimonials.reviews.review',
        'modular_blocks.product_banner.plp',
        'modular_blocks.cards.card.page',
        'modular_blocks.text_and_image.page'
      ]
    );
    console.log("homepage", entry[0]);
    setEntry(entry[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    getUser();
    getContent();
    ContentstackClient.onEntryChange(() => {
      getContent();
    });
  }, []);

  if (isLoading) return;

  return (
    <>
      <div
        data-pageref={entry?.uid}
        data-contenttype="homepage"
        data-locale={params.locale}
      >
        <Hero
          content={entry?.hero}
          locale={params.locale}
          withHeader={true}
          cslp={entry?.$?.hero}
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
              {block.hasOwnProperty("text_block") && (
                <TextBlock key={index} content={block.text_block} />
              )}
              {block.hasOwnProperty("cards") && (
                <Cards key={index} content={block.cards} />
              )}
              {block.hasOwnProperty("image_grid") && (
                <ImageGrid key={index} content={block.image_grid} />
              )}
              {block.hasOwnProperty("review") && (
                <Reviews key={index} content={block.review} />
              )}
              {block.hasOwnProperty("text_and_image") && (
                <HalfSquares key={index} content={block.text_and_image} />
              )}
              {block.hasOwnProperty("product_banner") && (
                <ProductFeature key={index} content={block.product_banner} />
              )}
              {block.hasOwnProperty("category_banner") && (
                <CategoryBanner key={index} content={block.category_banner} />
              )}
              {block.hasOwnProperty("tabs") && (
                <Tabs key={index} content={block.tabs} />
              )}
              {block.hasOwnProperty("marquee") && (
                <Marquee key={index} content={block.marquee} />
              )}
              {block.hasOwnProperty("lead_capture") && (
                <LeadCapture key={index} content={block.lead_capture} />
              )}
              {block.hasOwnProperty("agent") && (
                  <Agent key={index} agentData={block.agent} />
              )}
              {block.hasOwnProperty("recommendations_banner") && (
                  <RecommendationsBanner key={index} content={block.recommendations_banner} />
              )}
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </>
  );
}
