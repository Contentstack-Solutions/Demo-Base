"use client";
import {
  useEffect,
  useState,
} from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ContentstackClient } from '@/lib/contentstack-client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AllArticles({ }) {
  const [entries, setEntries] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const getContent = async () => {
    const entries = await ContentstackClient.getElementByType(
      "article",
      params.locale
    );

    setEntries(entries[0]);
    setIsLoading(false);
   
  };

  useEffect(() => {
    ContentstackClient.onEntryChange(getContent);
  }, []);


  if (isLoading) return;

  return (
    <>
      <Header locale={params.locale} />
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-8xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-medium text-3xl text-center tracking-widest text-neutral-700 uppercase">
              All Articles
            </h2>
            <p className="mt-2 font-paragraph font-light text-md whitespace-pre-wrap leading-8 text-neutral-700 italic">
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {entries.map((article) => (
              <article
                key={article.uid}
                className="flex flex-col items-start justify-between"
              >
                <Link href={(article.url ? article.url : "#")}>
                <div className="relative w-full">
                  
                  <img
                    src={article.banner_image.url}
                    alt=""
                    className="aspect-[16/9] w-full bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                 
                  <div className="absolute inset-0" />
                </div>
                </Link>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time className="text-gray-500">
                      Editorial Staff
                    </time>
                    {article?.taxonomies?.length > 0 && (
                      <div>
                    {article.taxonomies.map((tax, tdx) => {
                      return (
                        <Link
                          href={"/articles/categories/" + tax.term_uid}
                          key={tdx + tax.term_uid}
                          className="relative z-10 bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 capitalize"
                        >
                          {tax.term_uid}
                        </Link>
                      );
                    })}
                    </div>
                    )}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-paragraph font-medium leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={(article.url ? article.url : "#")}>
                        <span className="absolute inset-0" />
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm font-light font-paragraph tracking-wide leading-6 text-neutral-700 whitespace-break-spaces">
                      {article.teaser}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
