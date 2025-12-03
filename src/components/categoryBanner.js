import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function CategoryBanner({ content }){
    console.log("category banner", content);
    return(
        <div className="max-w-8xl mx-auto px-8 py-24">
            <h2 className="normal-case" {...content?.$?.title}>{content?.title}</h2>
            <p {...content?.$?.description}>{content?.description}</p>

            {content?.categories?.data?.length === 0 &&
                <div className="h-[800px] visual-builder__empty-block-parent" {...content?.$?.categories} >
                </div>
            }
            {content?.categories?.data?.length > 0 &&
                <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-5" {...content?.$?.categories}>
                    {content?.categories?.data?.map((item, index) => (
                        <Link href={'/plp/' + item?.url} key={index} >
                            <img className={(content.large_cards ? "h-[600px] " : "h-[300px] ") + " object-cover object-center w-full"} src={item?.image_path} />
                            <p className="mt-5">{item?.name}</p>
                            {/* <p className="mt-">{item?.price}</p> */}
                        </Link>
                    ))}
                </div>
            }

            {content?.plp &&
                <Link href={(content?.plp.length > 0 && content?.plp[0].url) ? content.plp[0].url : "#"} className="flex mt-5 items-center text-cyan-600 hover:text-[#D1A261]" {...content?.$?.plp}>
                    <p href={(content?.plp.length > 0 && content?.plp[0].url) ? content.plp[0].url : "#"} className="inline-block" {...content?.$?.plp_link_text}>{content?.plp_link_text}</p>
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
            }
        </div>
    )
}