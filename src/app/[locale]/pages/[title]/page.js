"use client";
import { useState, useEffect } from "react";
import { ContentstackClient } from "@/lib/contentstack-client"
import Footer from "@/components/footer";
import Header from "@/components/header";
import PageHero from "@/components/pageHero";
import TextSection from "@/components/textSection";
import People from "@/components/people";
import Hero from "@/components/hero";
import ArticleBanner from "@/components/articleBanner";
import ImageGrid from "@/components/imageGrid";
import Tabs from "@/components/tabs";
import Marquee from "@/components/marquee";
import FormBuilder from "@/components/formBuilder";
import Cards from "@/components/cards";
import Reviews from "@/components/reviews";
import CategoryBanner from "@/components/categoryBanner";
import Agent from "@/components/agent";
import LeadCapture from "@/components/leadCapture";
import ProductFeature from "@/components/productFeature";
import RecommendationsBanner from "@/components/recommendationsBanner";
import { useParams } from "next/navigation";

export default function Page({ }) {
    const [entry, setEntry] = useState({});
    const [isKiosk, setIsKiosk] = useState(false);
    const params = useParams();

    const getContent = async () => {
        const entry = await ContentstackClient.getElementByUrlWithRefs(
            "page",
            "/pages/" + params.title,
            params.locale,
            [
                'modular_blocks.hero.hero',
                'modular_blocks.hero_banner.hero',
                'modular_blocks.articles.articles',
                'modular_blocks.review.reference', 
                'modular_blocks.image_grid.image.page', 
                'modular_blocks.review.testimonials', 
                'modular_blocks.review.testimonials.reviews.review',
                'modular_blocks.product_banner.plp',
                'modular_blocks.cards.card.page',
                'modular_blocks.text_and_image.page'
            ]
        );
        setEntry(entry);
    };

    useEffect(() => {
        ContentstackClient.onEntryChange(getContent);
    }, []);

    return (
        <div >
            {entry?._applied_variants?.title !== "cs76fdee0e83c5c333" &&
                <Header locale={params.locale} />
            }
            <div className={entry?.modular_blocks?.length === 0 ? "visual-builder__empty-block-parent" : ""} {...entry?.$?.modular_blocks}>
                {entry?.modular_blocks?.map((block, index) => (
                    <div key={index} {...entry?.$?.['modular_blocks__' + index]}>
                        {block.hasOwnProperty("hero") &&
                            <PageHero key={index} content={block.hero} {...entry?.$?.['modular_blocks__' + index]}/>
                        }
                        {block.hasOwnProperty("people") &&
                            <People key={index} content={block.people} isKiosk={entry?._applied_variants?.title === "cs76fdee0e83c5c333"} />
                        }
                        {block.hasOwnProperty("text_block") &&
                            <TextSection key={index} content={block.text_block} />
                        }
                        {block.hasOwnProperty("cards") &&
                            <Cards key={index} content={block.cards} />
                        }
                        {block.hasOwnProperty("review") &&
                        <Reviews key={index} content={block.review} />
                        }
                        {block.hasOwnProperty("product_banner") && 
                            <ProductFeature key={index} content={block.product_banner} />
                        }
                        {block.hasOwnProperty("category_banner") && 
                            <CategoryBanner key={index} content={block.category_banner} />
                        }
                        {block.hasOwnProperty("lead_capture") &&
                            <LeadCapture key={index} content={block.lead_capture} />
                        }
                        {block.hasOwnProperty("agent") && 
                            <Agent key={index} agentData={block.agent} />
                        }
                        {block.hasOwnProperty("hero_banner") &&
                            <Hero key={index} content={block.hero_banner.hero} locale={params.locale} withHeader={false} />
                        }
                        {block.hasOwnProperty("image_grid") &&
                            <ImageGrid key={index} content={block.image_grid} isKiosk={entry?._applied_variants?.title === "cs76fdee0e83c5c333"} {...block.$?.image_grid}/>
                        }
                        {block.hasOwnProperty("articles") &&
                            <ArticleBanner key={index} content={block.articles} />
                        }
                        {block.hasOwnProperty("tabs") &&
                            <Tabs key={index} content={block.tabs} />
                        }
                        {block.hasOwnProperty("marquee") &&
                            <Marquee key={index} content={block.marquee} />
                        }
                        {block.hasOwnProperty("form_builder") &&
                            <FormBuilder key={index} content={block.form_builder} />
                        }
                        {block.hasOwnProperty("recommendations_banner") && (
                            <RecommendationsBanner key={index} content={block.recommendations_banner} />
                        )}
                    </div>
                ))}

            </div>

            {entry?._applied_variants?.title !== "cs76fdee0e83c5c333" &&
                <Footer />
            }

        </div>
    );
}
