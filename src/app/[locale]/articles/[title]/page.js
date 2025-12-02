"use client";
import Header from "@/components/header";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import { ContentstackClient } from "@/lib/contentstack-client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDataContext } from "@/context/data.context";

export default function ArticlesList({ }) {
  const [entry, setEntry] = useState({});
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const initialData = useDataContext();

  const getContent = async () => {
    const entry = await ContentstackClient.getElementByUrl(
      "article_list",
      `/articles/${params.title}`,
      params.locale,
    );
    setEntry(entry[0]);

    if (entry[0]?.taxonomy_category?.length > 0) {
      const articles = await ContentstackClient.getElementByTypeByTaxonomy(
        "article",
        params.locale,
        entry[0].taxonomy_category
      );
      setArticles(articles);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    ContentstackClient.onEntryChange(getContent);
  }, []);

  if (isLoading) return;

  return (
    <>
      <Header locale={params.locale} />
      {console.log("articles in component",articles)}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-8xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-medium text-3xl text-center tracking-widest text-neutral-700 uppercase" {...entry?.$?.header}>
              {entry?.header}
            </h2>
            <p className="mt-2 font-paragraph font-light text-md whitespace-pre-wrap leading-8 text-neutral-700 italic" {...entry?.$?.subtext}>
              {entry?.subtext}
            </p>
          </div>

          {entry?.taxonomy_category?.length === 0 &&
            <div className="flex h-64 w-full items-center justify-center" {...entry?.$?.taxonomy_category}>
              <p>Please select a taxonomy in the form.</p>
            </div>
          }
          {entry?.taxonomy_category?.length > 0 &&
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 " {...entry?.$?.taxonomy_category}>
              {articles?.map((article) => (
                <article
                  key={article.uid}
                  className="flex flex-col items-start "
                >
                  <Link href={(article.url ? article.url : "#")}>
                    <div className="relative w-full" {...article.banner_image?.$?.url}>
                      <img
                        src={article.banner_image?.url}
                        alt=""
                        className="aspect-[16/9] w-full bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                        {...article.banner_image?.$?.url}
                      />

                      <div className="absolute inset-0" />
                    </div>
                  </Link>
                  <div className="max-w-xl">
                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                      <time className="text-gray-500">Editorial Staff</time>

                      {article.taxonomies?.map((tax, tdx) => {
                        return (
                          <a
                            href={"/articles/categories/" + tax.term_uid}
                            key={tdx + tax.term_uid}
                            className="relative z-10 bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 capitalize"
                          >
                            {tax.term_uid}
                          </a>
                        );
                      })}
                    </div>
                    <div className="group relative">
                      <p className="mt-3 text-lg !font-medium leading-6 text-gray-900 group-hover:text-gray-600 uppercase">
                        <Link href={(article.url ? article.url : "#")} {...article.$?.title}>
                          {article.title}
                        </Link>
                      </p>
                      <p className="mt-5 line-clamp-3 text-sm font-light font-paragraph tracking-wide leading-6 text-neutral-700 whitespace-break-spaces" {...article.$?.teaser}>
                        {article.teaser}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          }
        </div>
      </div>
      <Footer />
    </>
  );
}
