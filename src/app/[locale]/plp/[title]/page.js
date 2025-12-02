"use client";
import { useState, useEffect, useRef } from "react";
import { ContentstackClient } from "@/lib/contentstack-client"
import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
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
import ResortPackage from "@/components/resortPackage";
import { AnimatePresence, motion } from "framer-motion";
import TypingIndicator from '@/components/typingIndicator';
import { useJstag } from "@/context/lyticsTracking";
import RecommendationsBanner from "@/components/recommendationsBanner";
import { useParams } from "next/navigation";

export default function PLP({ }) {
  const [entry, setEntry] = useState({});
  const [products, setProducts] = useState({});
  const [category, setCategory] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [filterText, setFilterText] = useState("Filter");
  const [filter, setFilter] = useState([]);
  const [counts, setCounts] = useState({});
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const jstag = useJstag();
  const params = useParams();

  const messagesEndRef = useRef(null);

  // Seed a welcome message from the assistant when chat opens for the first time
  const INITIAL_ASSISTANT_MESSAGE =
    "It looks like you’re interested in one of our adventure packages. Our most popular package is the 4 day adventure. Would you be interested in customizing your activities?";

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([{ role: "assistant", message: INITIAL_ASSISTANT_MESSAGE }]);
    }
  }, [chatOpen]);

    const getContent = async () => {
        const thePLP = await ContentstackClient.getPLPbyCategory(
            "plp",
            params.title,
            params.locale
        );
        getCategoryByURL(params.title)
        if (!thePLP) {
            const entry = await ContentstackClient.getElementByUrlWithRefs(
                "plp",
                "/plp/" + params.title,
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
                    'modular_blocks.text_and_image.page',
                    'modular_blocks.resort_package.resort_package',
                    'modular_blocks.resort_package.resort_package.products'
                ]
            );
            //console.log('plp', entry);
            setEntry(entry[0]);
            if (entry[0]?.product_category?.data[0]?.id) {
                getProducts(entry[0]?.product_category?.data.map(obj => obj.id));
            }
            else {
                //  setProducts({})
                getProductsByURL(params.title)
            }
        } else {
            setEntry(thePLP[0]);
            if (thePLP[0]?.product_category?.data[0]?.id) {
                getProducts(thePLP[0]?.product_category?.data.map(obj => obj.id));
            }
            else {
                // setProducts({})
                getProductsByURL(params.title)
            }
        }
    };

    const getCategoryByURL = async (id) => {
        let result = await fetch('/api/category/' + id, {
            method: "GET"
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.category.length > 0) {
                    setCategory(result?.category[0]);
                }
            })
            .catch((error) => console.error(error));
    }

    const getProducts = async (ids) => {
        //console.log('id list', ids);
        let tempProds = [];
        for(const id of ids){
            let result = await fetch('/api/categories/' + id, {
                method: "GET"
            })
                .then((response) => response.json())
                .then((result) => {
                    // let tempCounts = {};
                    // result.products?.forEach((product, index) => {
                    //     const filters = product.custom_data?.filter?.split(' ');
                    //     filters?.forEach((f, i) => {
                    //         if(tempCounts[f])
                    //             tempCounts[f] = tempCounts[f] + 1;
                    //         else
                    //             tempCounts[f] = 1;
                    //     })
                    // })
                    // setCounts(tempCounts);
                    
                    //setProducts(result);
                    tempProds.push(...result.products)
                    //console.log(result);
                })
                .catch((error) => console.error(error));
        }
        setProducts({products: tempProds})
    }

    const getProductsByURL = async (id) => {
        let result = await fetch('/api/category/' + id, {
            method: "GET"
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.category.length > 0) {
                    fetch('/api/categories/' + result.category[0].id, {
                        method: "GET"
                    })
                        .then((response) => response.json())
                        .then((result) => {
                            setProducts(result);
                        })
                        .catch((error) => console.error(error));
                }
            })
            .catch((error) => console.error(error));
    }
    useEffect(() => {
        ContentstackClient.onEntryChange(getContent);
        jstag.send({lead_score: 25});
        jstag.call('resetPolling');
        //fetchTaxonomyContent("6_day");
    }, [])

  const handleFilterChange = (item, isOn) => {
    if (isOn) {
      let temp = [...filter];
      temp.push(item);
      setFilter(temp);
    } else {
      const fils = filter.filter((f) => f !== item);
      setFilter(fils);
    }
  };
  const isInFilter = (terms) => {
    if (filter.length === 0) return true;
    if (!terms) return false;
    let filterTerms = terms.split(" ");
    for (let x = 0; x < filterTerms.length; x++) {
      if (filter.includes(filterTerms[x])) return true;
    }
  };
  //console.log("entry", entry)
  //console.log(category)
  // console.log(products)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEnterKey = async (e) => {
    jstag.call('resetPolling');
    if (e.key === "Enter" && chatInput.trim()) {
      const userText = chatInput.trim();
      const newConversation = [
        ...messages,
        { role: "user", message: userText },
      ];
      //setMessages(newConversation);
      const typing = [
        ...newConversation, {role: "waiting"}
      ]
      setMessages(typing);
      setChatInput("");

      // Call chatbot API with mapped messages ({ role, content })
      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newConversation.map(({ role, message }) => ({ role, content: message }))
          })
        });
        const data = await response.json();

        let assistantText = null;
        if (Array.isArray(data)) {
          const tool = data.find((d) => d?.type === 'tool_use' && d?.name === 'json_response');
          //console.log('tool', tool);
          //fetchTaxonomyContent(tool?.input?.term, tool.input.replaced_term);
          assistantText = tool?.input?.response ?? null;

          const term = tool?.input?.term ?? null;
          const replaced_term = tool?.input?.replaced_term ?? null;
          console.log('term', term);
          console.log('replaced_term', replaced_term);

          if (term && replaced_term) {
            fetchTaxonomyContent(term, replaced_term);
              if(term === 'scuba'){
                  jstag.send({padi_certified: true});
                  jstag.call('resetPolling');
              }
          }
        } else if (data && typeof data === 'object') {
          // fallback if the automation returns an object with an output property
          assistantText = data.output ?? null;
        }

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', message: assistantText || 'Sorry, I could not understand the response.' }
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', message: 'Something went wrong. Please try again.' }
        ]);
      }
    }
  };

  const fetchTaxonomyContent = async (term, replaceTerm) => {
    try {
      if (term === "generic") return;

      const scrollY = window.scrollY;

      const result = await Stack.getElementsByTaxonomy(params.locale, term, [
        "products",
      ]);
      console.log(result[0][0]);
      console.log('terms', term, replaceTerm);
      let tempEntry = { ...entry };
      if (result[0][0]._content_type_uid === "resort_package") {
        let foundIndex = entry.modular_blocks.findIndex((comp) =>
          comp.hasOwnProperty("resort_package")
        );
        let obj = {};
        obj["resort_package"] = {};
        obj["resort_package"]["resort_package"] = [result[0][0]];
        obj["wasReplaced"] = true;

        if (foundIndex > -1) tempEntry.modular_blocks[foundIndex] = obj;
        else tempEntry.modular_blocks = [...tempEntry.modular_blocks, obj];
      } else if (result[0][0]._content_type_uid === "pdp") {
        let tempEntry = { ...entry }; // clone entry

        let foundIndex = tempEntry.modular_blocks.findIndex((comp) =>
          comp.hasOwnProperty("resort_package")
        );

        if (foundIndex > -1) {
          let resortPackageBlock = tempEntry.modular_blocks[foundIndex];
          let products =
            resortPackageBlock.resort_package.resort_package[0].products;

          // Find index of product to replace
          let termUids = products.map((pdp) =>
            pdp.taxonomies && pdp.taxonomies.length > 0
              ? pdp.taxonomies[0].term_uid
              : null
          );
          let foundPdpIndex = termUids.indexOf(replaceTerm);

          if (foundPdpIndex > -1) {
            // Replace the specific product
            products[foundPdpIndex] = result[0][0];
            resortPackageBlock.wasReplaced = true;
          }
        }
      }
      setEntry(tempEntry);
      //console.log("temp test", tempEntry);
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    } catch (e) {
      console.log("error:", e);
    }
  };

  return (
    <div className="relative overflow-hidden ">
      <Header locale={params.locale} />
      <div className="flex">
        <div
          className={`pb-24 grow ${
            entry?.theme === "Light" || !entry?.theme
              ? "bg-white text-black"
              : "bg-[#101827] text-[#f5f9ff]"
          }`}
        >
          <AnimatePresence mode="wait">
            <div
              className={
                entry?.modular_blocks?.length === 0
                  ? "visual-builder__empty-block-parent"
                  : ""
              }
              {...entry?.$?.modular_blocks}
            >
              {entry?.modular_blocks?.map((block, index) => {
                const metadata = entry?.$?.[`modular_blocks__${index}`];
                const uniqueKey = `${Object.keys(block)[0]}_${index}_${
                  block.wasReplaced ? "replaced" : "original"
                }`;

                const blockContent = (
                  <>
                    {block.hasOwnProperty("resort_package") && (
                      <motion.div
                        key={`resort_package_${block.resort_package.resort_package[0]?.products?.map(p => p.uid).join("_")}`}
                        // initial={{ opacity: 0, y: 20 }}
                        // animate={{ opacity: 1, y: 0 }}
                        // exit={{ opacity: 0, y: -20 }}
                        // transition={{ duration: 0.5 }}
                      >
                        <ResortPackage
                         content={block.resort_package.resort_package[0]}
                          params={params}
                          {...metadata}
                        />
                      </motion.div>
                    )}
                    {block.hasOwnProperty("hero") && (
                      <PageHero
                        key={index}
                        content={block.hero}
                        {...metadata}
                      />
                    )}
                    {block.hasOwnProperty("people") && (
                      <People
                        key={index}
                        content={block.people}
                        isKiosk={
                          entry?._applied_variants?.title ===
                          "cs76fdee0e83c5c333"
                        }
                      />
                    )}
                    {block.hasOwnProperty("text_block") && (
                      <TextSection key={index} content={block.text_block} />
                    )}
                    {block.hasOwnProperty("cards") && (
                      <Cards key={index} content={block.cards} />
                    )}
                    {block.hasOwnProperty("review") && (
                      <Reviews key={index} content={block.review} />
                    )}
                    {block.hasOwnProperty("product_banner") && (
                      <ProductFeature
                        key={index}
                        content={block.product_banner}
                      />
                    )}
                    {block.hasOwnProperty("category_banner") && (
                      <CategoryBanner
                        key={index}
                        content={block.category_banner}
                      />
                    )}
                    {block.hasOwnProperty("lead_capture") && (
                      <LeadCapture key={index} content={block.lead_capture} />
                    )}
                    {block.hasOwnProperty("agent") && (
                      <Agent key={index} agentData={block.agent} />
                    )}
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
                          entry?._applied_variants?.title ===
                          "cs76fdee0e83c5c333"
                        }
                        {...block?.$?.image_grid}
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
                  </>
                );

                return block.wasReplaced ? (
                  <motion.div
                    key={uniqueKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {blockContent}
                  </motion.div>
                ) : (
                  <div key={uniqueKey} {...metadata}>
                    {blockContent}
                  </div>
                );
              })}
            </div>
          </AnimatePresence>
          {/* {entry?.image?.url &&
                    <img src={entry?.image?.url} className="w-full max-h-[500px] object-cover">
                    </img>
                } */}
          <h1 className="text-center mt-8 mb-16">
            {entry?.headline ? entry?.headline : category?.name}
          </h1>
          {/* <div
                    className="max-w-8xl mx-auto px-8 flex mt-10 cursor-pointer"
                    onClick={() => setFilterOpen(true)}
                >
                    <div className="ml-auto flex items-center">
                        <FunnelIcon className="size-5 mr-2" />
                        <p className="">Filter</p>
                    </div>
                </div> */}
          <div
            className={
              "fixed flex flex-col bg-white border-r w-[420px] top-0 h-screen z-40 p-6 transition-all duration-300 " +
              (filterOpen ? "right-0 no-doc-scroll" : "-right-[100%]")
            }
          >
            <div className="flex items-center justify-between">
              <ArrowLeftIcon
                className={"size-5 " + (itemOpen ? "" : "invisible")}
                onClick={() => {
                  setItemOpen(false);
                  setFilterText("Filter");
                }}
              />
              <p className="text-center font-light">{filterText}</p>
              <XMarkIcon
                className="size-5 cursor-pointer"
                onClick={() => setFilterOpen(false)}
              />
            </div>
            <div className="relative mt-8 overflow-hidden h-full">
              <div
                className={
                  "absolute top-0 bg-white h-full w-full  transition-all duration-300  " +
                  (itemOpen ? "right-0" : "-right-[100%]")
                }
              >
                {entry?.filters
                  ?.filter((f) => f.category === filterText)
                  .map((option, index) => (
                    <div key={index}>
                      {option.option_items.map((optionItem, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between font-light mt-4"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2 size-4"
                              onChange={(e) =>
                                handleFilterChange(
                                  optionItem.product_category_value,
                                  e.target.checked
                                )
                              }
                            />
                            <p>{optionItem.option_name}</p>
                          </div>
                          <p>
                            [{" "}
                            {counts[optionItem.product_category_value]
                              ? counts[optionItem.product_category_value]
                              : 0}{" "}
                            ]
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
              {entry?.filters?.map((filter, index) => (
                <div
                  key={index}
                  className="flex justify-between font-light mt-4 cursor-pointer group"
                  onClick={() => {
                    setItemOpen(true);
                    setFilterText(filter.category);
                  }}
                >
                  <p className="tracking-normal group-hover group-hover:text-cyan-600">
                    {filter.category}
                  </p>
                  <ArrowRightIcon className="size-5 group-hover:-mr-1" />
                </div>
              ))}
            </div>
            <button className="mt-auto rounded-md button px-8 py-4 text-md tracking-widest uppercase font-bold text-cyan-600 shadow-sm ring-2 ring-inset ring-cyan-600 hover:text-white hover:bg-cyan-600">
              Reset
            </button>
          </div>
          <div
            className={
              "fixed bg-black top-0 h-screen w-full z-30 transition-opacity duration-300 " +
              (filterOpen ? "opacity-60" : "hidden opacity-0")
            }
            onClick={() => setFilterOpen(false)}
          ></div>
          <div className="max-w-8xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-2 gap-8 gap-y-16">
            {products?.products?.map((item, index) => {
              if (isInFilter(item?.custom_data?.filter)) {
                return (
                  <Link
                    key={index}
                    href={item.url ? "/pdp/" + item.url : "#"}
                    className="block"
                  >
                    <div className="  ">
                      <div className="relative group overflow-hidden">
                        <img
                          className={
                            (entry?.large_cards ? "h-[600px] " : "h-[300px] ") +
                            " object-cover w-full"
                          }
                          src={item.image_path}
                        />
                        {/* <div className="absolute top-0 left-0 w-full h-full hidden group-hover:block">
                                            <img className="h-[600px] object-cover" src={item.images.length > 1 ? item.images[1].url : ""} />
                                        </div> */}
                        <div className="absolute top-0 left-[100%] w-full h-full bg-[#F3F5F9] px-10 group-hover:left-0 hover:transition-all duration-300">
                          <div className="flex flex-col h-full w-full justify-center">
                            <p className="text-3xl text-black">{item?.name}</p>
                            <p className="mt-5 text-sm text-black">{item.custom_data?.find(obj => obj.key === "teaser")?.value}</p>
                            <p className="text-3xl mt-10 text-black">
                              {item?.price}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xl mt-2">{item?.name}</p>
                      <p className="">{item.price}</p>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </div>

      {!chatOpen && entry?.show_agent && (
        <div
          className="fixed bottom-5 right-5 p-5 rounded-full bg-[#ffeecb] shadow-md"
          onClick={() => setChatOpen(true)}
        >
          <p className="text-sm font-medium">Create Your Dream Vacation</p>
        </div>
      )}

      {chatOpen && entry?.show_agent && (
        <div className="fixed bottom-0 right-10 h-[500px] w-[400px] rounded-t-md border border-[#33344a] shadow flex flex-col">
          <div className="border-b border-[#ffeecb] bg-[#33344a] p-3 flex justify-between items-center">
            <p className="font-normal text-white">Concierge</p>
            <button
            className="cursor-pointer ms-auto text-white"
            type="button"
            onClick={() => setChatOpen(false)}
          >
            <XMarkIcon className="size-6 ml-4" />
          </button>
          </div>

          <div
            className="grow p-3 bg-gradient-to-br from-[#00425b] to-[#717788] overflow-y-scroll"
            ref={messagesEndRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[80%] ${
                    message.role === "user" ? "bg-[#ffeecb]" : "bg-[#f1f1e6]"
                  }`}
                >
                    {message.role === "waiting" &&
                        <TypingIndicator isTyping={true} />
                    }
                  <p key={index} className="text-sm font-light">
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="">
            <input
              className="w-full p-3 bg-[#33344a] text-white"
              onKeyDown={handleEnterKey}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="How can I help?"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
