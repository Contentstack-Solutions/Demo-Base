"use client";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function UnlockAdventureSection({ content }) {
  const vehicles = Array.isArray(content?.vehicles) ? content.vehicles : [];
  return (
    <section
      className="relative overflow-hidden pt-8 pb-12 max-w-7xl lg:max-w-[96%] mx-auto bg-[#e3e3e3]"
      data-section="unlock-adventure"
      style={{
        backgroundImage: `url(${content?.background_image?.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top -90px',
        backgroundRepeat: 'no-repeat',
      }}
    >

      <div className="relative z-[1] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-4 text-center">
          <h2
            className="mb-2 font-riftdemi text-[40px] leading-[1.1] font-[500] uppercase text-isuzu-red lg:text-[70px] lg:leading-[1.1]"
            {...content?.$?.title || {}}
          >
            {content?.title}
          </h2>
          <p
            className="mx-auto max-w-2xl whitespace-pre-line text-pretty font-aktiv_grotesk text-base text-neutral-800"
            {...(content?.$?.description || {})}
          >
            {content?.description}
          </p>
        </header>

        <div
          className="grid sm:gap-12 grid-cols-2 md:gap-6 lg:gap-10"
          {...(content?.$?.vehicles || {})}
        >
          {vehicles.map((vehicle, index) => (
            <VehicleColumn
              key={vehicle._metadata?.uid ?? `vehicle-${index}`}
              vehicle={vehicle}
              content={content}
              vehicleIndex={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function VehicleColumn({ vehicle, content, vehicleIndex }) {
  const imageSrc = vehicle?.vehicle_image?.url;
  const outlineSrc = vehicle?.hover_background?.url;
  const alt =
    vehicle?.vehicle_image?.title ||
    vehicle?.vehicle_image?.filename ||
    "Isuzu vehicle";

  const blockAttrs = content?.$?.[`vehicles__${vehicleIndex}`] || {};

  return (
    <div className="group flex flex-col items-center justify-center" {...blockAttrs}>
      <div className="relative w-full">
        {/* Outline watermark — rendered first so it sits behind the vehicle (z-0) */}
        {outlineSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={outlineSrc}
            alt=""
            className="pointer-events-none absolute inset-x-0 top-[-60%] z-0 h-full w-full object-contain object-bottom opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            aria-hidden
            {...(content?.$?.[`vehicles__${vehicleIndex}.hover_background`] ||
              {})}
          />
        ) : null}

        <div className="relative w-full overflow-visible bg-transparent py-2 px-4">
          <div className={`relative flex min-h-[200px] items-end ${vehicleIndex === 0 ? 'justify-end' : 'justify-start'} sm:min-h-[240px] md:min-h-[280px]`}>
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={alt}
                className="relative z-[1] max-h-[220px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_20px_32px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out group-hover:scale-[1.02] lg:max-h-[260px] xl:max-h-[300px]"
                {...(content?.$?.[`vehicles__${vehicleIndex}.vehicle_image`] ||
                  {})}
              />
            ) : (
              <div
                className="relative z-[1] flex h-[200px] w-full max-w-md items-center justify-center rounded-lg border border-dashed border-neutral-400/60 bg-transparent text-sm text-neutral-500 sm:h-[240px] md:h-[260px]"
                aria-hidden
              >
                Vehicle image
              </div>
            )}
            
          </div>
        </div>
      </div>

      <div className={`flex justify-center pt-2`}>
            <a
              href={vehicle?.internal_url?.[0]?.url}
              className="flex items-center justify-center gap-1.5 rounded-full border border-isuzu-red bg-transparent px-4 py-1 font-aktiv_grotesk text-[11px] font-semibold uppercase text-neutral-800 transition-colors hover:bg-isuzu-red hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-isuzu-red md:text-xs"
              {...(content?.$?.[`vehicles__${vehicleIndex}.cta_text`] || content?.$?.[`vehicles__${vehicleIndex}.internal_url`] || {})}
            >
              <span className="font-riftdemi text-[16px] font-[500] pt-[1.5px]">{vehicle?.cta_text}</span>
              <ChevronRightIcon className="size-4 pt-[1.5px]" />
            </a>
          </div>
     
    </div>
  );
}
