import Link from "next/link";
export default function HalfSquares({ content }) {
  return (
    <div
      className={
        "md:flex " +
        (content?.image_align === "Image Right"
          ? "md:flex-row-reverse"
          : "md:flex-row") +
        (content?.vertical_margin ? " my-10" : "")
      }
      {...content?.$?.image_align}
    >
      <div
        className="md:w-1/2 aspect-square bg-cover"
        style={{ backgroundImage: `url(${content?.image?.url})` }}
        {...content?.image?.$?.url}
      >
        {!content?.image?.url &&
          <div className="h-full w-full bg-gray-400 flex items-center justify-center" {...content?.$?.image}>
            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        }
      </div>
      <div className="md:w-1/2 flex ">
        <div className="mx-auto md:my-auto w-80 my-24">
          <h2 className="text-neutral-700" {...content?.$?.headline}>{content?.headline}</h2>

          <p className="mt-7 text-neutral-700 leading-7"  {...content?.$?.body}>{content?.body}</p>

          {content.page && (
            <Link href={(content?.page?.length > 0 && content?.page[0]?.url) ? content?.page[0]?.url : '#'}>
            <button className="mt-10 rounded-md button px-8 py-4 text-md tracking-widest uppercase font-bold text-cyan-600 shadow-sm ring-2 ring-inset ring-cyan-600 hover:text-white hover:bg-cyan-600"  {...content?.$?.button_text}>
              {content?.button_text}
            </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
