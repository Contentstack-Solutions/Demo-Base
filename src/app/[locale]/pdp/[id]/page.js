"use client";
import { useState, useEffect } from "react";
import { ContentstackClient } from "@/lib/contentstack-client"
import Footer from "@/components/footer";
import Header from "@/components/header";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { LyticsTracking, useEntity, useJstag } from "@/context/lyticsTracking";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
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
import Link from "next/link";


export default function Page({  }) {
  const [entry, setEntry] = useState({});
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [purchaseOpen, setPurchaseOpen] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const lyticsProfileData = useEntity();
  const [isOpen, setIsOpen] = useState(false);
  const jstag = useJstag();
  const params = useParams();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleChange = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  function buyClick(price) {
    jstag.send({
      shopify_total_spend: price, //pulls price of product entry and increments field
      _e: "purchase", //sends event named purchase to Data Cloud
      email: inputValue, // pulls input value from form and sends to Data Cloud
    });
    jstag.call("resetPolling"); // resets polling to fetch profile quicker
    setInputValue("");
  }

  function getRandomNumberBetween15And20() {
  return Math.floor(Math.random() * (20 - 15 + 1)) + 15;
  }


  const getContent = async () => {
    if (params.id === "untitled" || !params.id) return;
    let theEntry = await ContentstackClient.getPDPbyProduct("pdp", params.id, params.locale);
    if (!theEntry) {
      theEntry = await ContentstackClient.getElementByUrlWithRefs(
        "pdp",
        "/pdp/" + params.id,
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
      if (theEntry?.product?.data.length > 0 && theEntry?.product?.data[0].url)
        getProduct(theEntry.product.data[0].url);
      else getProduct(params.id);
    } else {
      getProduct(params.id);
    }

    console.log("pdp", theEntry);

    setEntry(theEntry);
    if (theEntry || product) setIsLoading(false);
  };

  const getProduct = async (id) => {
    console.log("fetching by url", id);
    let result = await fetch("/api/products/" + id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('fetch result', result);
        setProduct(result.product);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    ContentstackClient.onEntryChange(getContent);
  }, []);

  useEffect(() => {
    const tags = entry?.tags
    if(tags){
     Object.keys(tags).forEach(key => {
      if(tags[key] === 'adventure'){
        const number = getRandomNumberBetween15And20();
        if ((!lyticsProfileData?.data?.user?.likely_premier_score) || (lyticsProfileData?.data?.user?.likely_premier_score <= 80)){
          jstag.send({likely_premier_score: number});
          jstag.call('resetPolling');
        }
      }
    });
  }
  }, [entry]);

  useEffect(() => {
    //console.log("lytics use effect", lyticsProfileData);
    if (lyticsProfileData?.data?.user?.segments?.length > 0) {
      if (
        lyticsProfileData.data.user.segments.includes("likely_premier_customer")
      ) {
        //console.log("found premier");
        if (!isOpen && localStorage.getItem("offerShown") !== "true") {
          setIsOpen(true);
          localStorage.setItem("offerShown", "true");
        }
      }
    }
  }, [lyticsProfileData]);

  //console.log(entry);
  //console.log("product", product);
  return (
    <div className="relative">
      <Header locale={params.locale} />
      <LyticsTracking></LyticsTracking>
      <div className="max-w-8xl mx-auto px-8 pt-10 flex flex-col font-paragraph mb-12">
        <div className="w-full md:flex gap-16">
          <div className="md:w-1/2">
            <button
              onClick={() => handleGoBack()}
              className="flex mb-4 items-center text-cyan-600 hover:text-[#D1A261]"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <p className="inline-block">Back to previous products</p>
            </button>

            {product?.images?.length > 0 && (
              <img
                className="object-cover mx-auto h-[500px] w-full"
                src={
                  entry?.images?.length > 0
                    ? entry?.images[imageIndex].image?.url
                    : product?.images[imageIndex].path
                }
              />
            )}

            <div className="mt-10 flex">
              {(entry?.images?.length === 0 || !entry?.images) && (
                <div className="flex gap-5 mx-auto">
                  {product?.images?.map((image, index) => (
                    <div
                      key={index}
                      className={
                        "border p-2 cursor-pointer " +
                        (imageIndex === index
                          ? "border-black"
                          : "border-gray-300")
                      }
                      onClick={() => setImageIndex(index)}
                    >
                      <img
                        className="h-[68px] w-[68px] object-cover"
                        src={image?.path}
                      />
                    </div>
                  ))}
                </div>
              )}
              {entry?.images?.length > 0 && (
                <div className="flex gap-5 mx-auto">
                  {entry?.images?.map((image, index) => (
                    <div
                      key={index}
                      className={
                        "border p-2 cursor-pointer " +
                        (imageIndex === index
                          ? "border-black"
                          : "border-gray-300")
                      }
                      onClick={() => setImageIndex(index)}
                    >
                      <img
                        className="h-[68px] w-[68px]"
                        src={image.image?.url}
                        {...image?.$?.image}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:w-1/2 mt-10">
            <h2 className="text-[24px] leading-none mt-8" {...entry?.$?.product_name}>
              {entry?.product_name ? entry?.product_name : product?.name}
            </h2>
            <div className="mt-8 md:w-3/4">
              <p>{entry?.teaser ? entry?.teaser : product?.custom_data?.find(obj => obj.key === "teaser")?.value}</p>
            </div>
            {(product?.price || entry?.price) && (
              <p className="text-[32px] mt-8">
                {entry?.price ? entry?.price : product?.price}
              </p>
            )}
            <div id="wrapper" className="relative w-1/2 mt-4">
              <button
                className="mt-2 w-full text-nowrap relative rounded-md button px-8 py-4 text-md tracking-widest uppercase bg-cyan-600 font-bold text-white shadow-sm ring-2 ring-inset hover:ring-cyan-600 hover:text-cyan-600 hover:bg-white"
                onClick={() => setPurchaseOpen(true)}
              >
                Book Now
              </button>
            </div>

            
          </div>
        </div>
        <h2 className="text-[24px] leading-none normal-case mt-8">
          Description
        </h2>
        <div
          className="mt-4 font-extralight whitespace-pre-line [&_p]:mt-3 [&_ul]:list-disc  [&_ul]:pl-10 text-sm tracking-wide"
          dangerouslySetInnerHTML={{
            __html: entry?.description
              ? entry?.description
              : product?.description,
          }}
          {...entry?.$?.description}
        ></div>
      </div>

      <div
        className={`fixed top-0 h-full bg-black opacity-50 w-full z-40 hidden ${purchaseOpen ? "sm:block" : ""
          }`}
      ></div>
      <div
        className={`fixed w-full sm:w-[350px] z-50 h-full top-0 border-r bg-white shadow-lg p-4  transition-all duration-500 ${purchaseOpen ? "left-0" : "-left-full sm:-left-[350px] "
          }`}
      >
        <XMarkIcon
          className="size-5 ml-auto cursor-pointer"
          onClick={() => setPurchaseOpen(false)}
        />

        <p className="">Your purchase:</p>

        <p className="mt font-medium ">
          {entry?.product_name ? entry?.product_name : product?.name}
        </p>

        <div className="flex mt-10">
          <div className="w-5/12">
            <p>Price:</p>
            <p className="mt-3">Total:</p>
          </div>
          {product?.price && (
            <div className="w-7/12">
              <p>{entry?.price ? entry?.price : product?.price}</p>
              <p className="mt-3">
                {entry?.price ? entry?.price : product?.price}
              </p>
            </div>
          )}
        </div>

        <form className="mt-6 flex w-full">
          <input
            className="rounded-lg w-full py-2 px-4 max-md:p-1 border mr-0 text-gray-800 border-gray-200 bg-white"
            placeholder="Email"
            value={inputValue}
            onChange={handleChange}
          />
        </form>

        <div className="flex mt-3">
          {/* <input type="checkbox" checked /> */}
          <label className="ml-2">Use card on file</label>
        </div>

        <div className="mt-2 bg-[#efefef] py-2 px-4 flex items-center gap-4">
          <img
            className="h-8"
            src="https://images.contentstack.io/v3/assets/blt678db9efc83edd2d/blt237b95a3377390c0/681bec8e9b0925fa46df2048/amex-svgrepo-com.svg"
          />
          <p>...5309</p>
        </div>

        <button
          onClick={() => buyClick(entry?.price ? entry?.price : product?.price)}
          className="bg-black text-white rounded-lg py-4 w-full mt-10 font-semibold  tracking-wide border-black border-2 hover:bg-white hover:text-black"
        >
          Complete Purchase
        </button>

        <button className="rounded-lg border-2 border-[#5a30f4] w-full mt-4 flex justify-center p-2">
          <img
            className="h-10"
            src="https://images.contentstack.io/v3/assets/blt678db9efc83edd2d/bltbc9d297783dbfffc/681e1c146b233bd9775c08c4/spay.png"
          />
        </button>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/70" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-[1000px] space-y-4 bg-white ">
            <div className="flex gap-8">
              <div className="w-3/5">
                <img
                  className="h-full object-cover"
                  src="https://images.contentstack.io/v3/assets/blt441ffce57ce4e444/blt4b377ead86261bae/689f816a65a024bd4c550ae8/snorkeling_couple.avif"
                />
              </div>

              <div className="w-2/5 p-4 flex flex-col content-center flex-wrap justify-center">
                <p className="text-center font-medium text-[28px] font-cinzel">
                  Exclusive Package Access
                </p>
                <p className="mt-5 ">
                  Red Panda Resort is your gateway to adventure. Explore luxury
                  packages for every level of adventurer
                </p>
                <Link href="/plp/package-offers-exclusive" className="mx-auto mt-5">
                  <button className="rounded-md button mt-6 px-8 py-4 text-md tracking-widest uppercase font-bold text-cyan-600 shadow-sm ring-2 ring-inset ring-cyan-600 hover:text-white hover:bg-cyan-600">
                    Show me
                  </button>
                </Link>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div
        className={
          entry?.modular_blocks?.length === 0
            ? "visual-builder__empty-block-parent"
            : ""
        }
        {...entry?.$?.modular_blocks}
      >
        {entry?.modular_blocks?.map((block, index) => (
          <div key={index} {...entry?.$?.["modular_blocks__" + index]}>
            {block.hasOwnProperty("hero") && (
              <PageHero
                key={index}
                content={block.hero}
                {...entry?.$?.["modular_blocks__" + index]}
              />
            )}
            {block.hasOwnProperty("people") && (
              <People
                key={index}
                content={block.people}
                isKiosk={
                  entry?._applied_variants?.title === "cs76fdee0e83c5c333"
                }
              />
            )}
            {block.hasOwnProperty("text_block") && (
              <TextSection key={index} content={block.text_block} />
            )}
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
            {block.hasOwnProperty("hero_banner") && (
              <Hero
                key={index}
                content={block.hero_banner.hero}
                locale={params.locale}
                withHeader={false}
              />
            )}
            {block.hasOwnProperty("image_grid") && (
              <ImageGrid
                key={index}
                content={block.image_grid}
                isKiosk={
                  entry?._applied_variants?.title === "cs76fdee0e83c5c333"
                }
                {...block.$?.image_grid}
              />
            )}
            {block.hasOwnProperty("articles") && (
              <ArticleBanner key={index} content={block.articles} />
            )}
            {block.hasOwnProperty("tabs") && (
              <Tabs key={index} content={block.tabs} />
            )}
            {block.hasOwnProperty("marquee") && (
              <Marquee key={index} content={block.marquee} />
            )}
            {block.hasOwnProperty("form_builder") && (
              <FormBuilder key={index} content={block.form_builder} />
            )}
            {block.hasOwnProperty("recommendations_banner") && (
              <RecommendationsBanner key={index} content={block.recommendations_banner} />
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
