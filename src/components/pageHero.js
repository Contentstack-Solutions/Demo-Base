"use client";

export default function PageHero({ content }) {
  return (
    <div>
        <div>
          {content?.style === "Full Image" && (
            <div
              className={`${content?.style === "Full Image" ? "" : "hidden"} ${
                content?.text_color === "Light"
                  ? "text-white"
                  : "text-neutral-700"
              } relative flex h-[800px] bg-neutral-600 bg-cover bg-top`}
              style={{ backgroundImage: `url(${content?.image?.url})` }}
            >
              {!content?.image?.url && (
                <div className="absolute top-0 left-0  w-full h-[800px]">
                  <div
                    className="bg-gray-500 -z-20 flex items-center justify-center h-full"
                    {...content?.$?.image}
                  >
                    <svg
                      className="w-10 h-10 text-gray-200 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                </div>
              )}
              {content?.layout === "Text Right" && (
                <div className="flex px-8 gap-8 my-auto z-50 max-w-7xl w-full text-right mx-auto justify-right">
                  <div className="font-paragraph ml-auto">
                    <p
                      className={`text-[60px] leading-tight ${
                        content?.text_color === "Light"
                          ? "text-white"
                          : "text-[#005D94]"
                      } tracking-wider font-paragraph`}
                      {...content?.$?.headline}
                    >
                      {content?.headline}
                    </p>
                    <p
                      className="mt-4 whitespace-pre-wrap text-xl"
                      {...content?.$?.details}
                    >
                      {content?.details}
                    </p>
                  </div>
                </div>
              )}
              {content?.layout === "Text Left" && (
                <div className="flex px-8 gap-8 mx-auto z-50 max-w-7xl w-full my-auto">
                  <div className="font-paragraph">
                    <p
                      className={`text-[60px] leading-tight ${
                        content?.text_color === "Light"
                          ? "text-white"
                          : "text-[#005D94]"
                      } tracking-wider font-paragraph`}
                      {...content?.$?.headline}
                    >
                      {content?.headline}
                    </p>
                    <p
                      className="mt-4 whitespace-pre-wrap text-xl"
                      {...content?.$?.details}
                    >
                      {content?.details}
                    </p>
                  </div>
                </div>
              )}
              {content?.layout === "Center" && (
                <div className="flex px-24 gap-8 my-auto z-50 mx-auto text-center">
                  <div className="font-paragraph">
                    <p
                      className={`text-[60px] leading-tight ${
                        content?.text_color === "Light"
                          ? "text-white"
                          : "text-[#005D94]"
                      } tracking-wider font-paragraph`}
                      {...content?.$?.headline}
                    >
                      {content?.headline}
                    </p>
                    <p
                      className="mt-4 whitespace-pre-wrap text-xl"
                      {...content?.$?.details}
                    >
                      {content?.details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {content?.style !== "Full Image" && (
            <div
              className={`hidden  ${
                content?.style === "Full Image" ? "hidden" : "md:block"
              }  mx-auto px-8 `}
            >
              {(content?.layout === "Text Right" ||
                content?.layout === "Center") && (
                <div className="flex  gap-8 items-center">
                  <div className="w-1/2 flex">
                    {content?.image?.url && (
                      <img
                        className=""
                        src={content?.image?.url}
                        {...content?.$?.image}
                      />
                    )}
                    {!content?.image?.url && (
                      <div className="w-full h-[800px]" {...content?.$?.image}>
                        <div className="bg-gray-300 flex items-center justify-center h-full">
                          <svg
                            className="w-10 h-10 text-gray-200 dark:text-gray-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                          >
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="font-paragraph mx-auto max-w-lg">
                    <p
                      className="text-[60px] leading-tight text-[#005D94] tracking-wider font-paragraph"
                      {...content?.$?.headline}
                    >
                      {content?.headline}
                    </p>
                    <p
                      className="mt-4 whitespace-pre-wrap text-lg"
                      {...content?.$?.details}
                    >
                      {content?.details}
                    </p>
                  </div>
                </div>
              )}
              {content?.layout === "Text Left" && (
                <div className="flex gap-8 items-center">
                  <div className="w-1/2 flex">
                    <div className="font-paragraph mx-auto max-w-lg">
                      <p
                        className="text-[60px] leading-tight text-[#005D94] tracking-wider font-paragraph"
                        {...content?.$?.headline}
                      >
                        {content?.headline}
                      </p>
                      <p
                        className="mt-4 whitespace-pre-wrap text-lg"
                        {...content?.$?.details}
                      >
                        {content?.details}
                      </p>
                    </div>
                  </div>

                  <div className="w-1/2">
                    {content?.image?.url && (
                      <img
                        className=""
                        src={content?.image?.url}
                        {...content?.$?.image}
                      />
                    )}
                    {!content?.image?.url && (
                      <div className="w-full h-[800px]" {...content?.$?.image}>
                        <div className="bg-gray-300 flex items-center justify-center h-full">
                          <svg
                            className="w-10 h-10 text-gray-200 dark:text-gray-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                          >
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            className={`md:hidden ${
              content?.style === "Full Image" ? "hidden" : ""
            } max-w-7xl mx-auto px-8 `}
          >
            {content?.image?.url && (
              <img
                className=""
                src={content?.image?.url}
                {...content?.$?.image}
              />
            )}
            {!content?.image?.url && (
              <div className="w-full h-[800px]" {...content?.$?.image}>
                <div className="bg-gray-300 flex items-center justify-center h-full">
                  <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              </div>
            )}

            <div className="font-paragraph mt-8">
              <p
                className="text-[60px] leading-tight text-[#005D94] tracking-wider font-paragraph"
                {...content?.$?.headline}
              >
                {content?.headline}
              </p>
              <p className="mt-4 whitespace-pre-wrap" {...content?.$?.details}>
                {content?.details}
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
