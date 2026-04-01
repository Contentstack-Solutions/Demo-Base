"use client";
import { ChevronRightIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ContentstackClient } from "@/lib/contentstack-client";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

export default function PreviewVehicle({ content }) {
  const models = Array.isArray(content?.vehicle_models) ? content.vehicle_models : [];
  const modelUids = models.map(model => model.uid);
  const [activeIndex, setActiveIndex] = useState(0);
  const { locale } = useParams();
  const [vehicleVariations, setVehicleVariations] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
  console.log("🚀 ~ PreviewVehicle ~ selectedVariation:", selectedVariation)
  const [selectedColour, setSelectedColour] = useState(null);
  const activeModel = models[activeIndex];


  const fetchMuxProductData = async () => {
    const data = await ContentstackClient.getElementByReference('vehicle_variation', locale, [...modelUids])
    const groupedData = data.reduce((acc, item) => {
      // vehicle_model is a Contentstack reference array
      const uid = item.vehicle_model?.[0]?.uid ?? item.vehicle_model?.uid;
      if (!uid) return acc;
      if (!acc[uid]) acc[uid] = [];
      acc[uid].push(item);
      return acc;
    }, {});
    setVehicleVariations(groupedData);
    // pre-select first variation of the initially active model
    const firstModelUid = models[activeIndex]?.uid;
    const firstVariation = groupedData[firstModelUid]?.[0] ?? null;
    setSelectedVariation(firstVariation);
    setSelectedColour(firstVariation?.available_colours?.[0] ?? null);
  }

  useEffect(() => {
    if (window.location.pathname.includes('/mu-x')) {
        fetchMuxProductData();
    }
  }, [])

  return (
    <section
      className="bg-white pb-12"
      data-section="preview-vehicle"
      {...(content?.$?.title || {})}
    >
      <div className="mx-auto max-w-6xl">

        {/* Title */}
        <h2
          className="mt-[40px] mb-[20px] text-center font-riftdemi text-[48px] font-bold uppercase text-neutral-900"
          {...(content?.$?.title || {})}
        >
          {content?.title}
        </h2>

        {/* Model tabs */}
        <div
          className="border-b border-neutral-200 w-[65%] mx-auto"
          {...(content?.$?.vehicle_models || {})}
        >
          <div className="flex w-full">
            {models.map((model, index) => (
              <button
                key={model.uid}
                onClick={() => {
                  setActiveIndex(index);
                  const firstVariation = vehicleVariations[model.uid]?.[0] ?? null;
                  setSelectedVariation(firstVariation);
                  setSelectedColour(firstVariation?.available_colours?.[0] ?? null);
                }}
                className={
                  "relative w-1/4 pb-1 font-riftdemi text-[18px] font-semibold uppercase transition-colors " +
                  (index === activeIndex
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-600")
                }
                {...(content?.$?.[`vehicle_models__${index}`] || {})}
              >
                {model.heading}
                {index === activeIndex && (
                  <span className="absolute inset-x-0 -bottom-px h-[3px] bg-isuzu-red" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active model panel */}
        {activeModel && (
          <div className="mt-4" key={activeModel.uid}>

            {vehicleVariations?.[activeModel.uid]?.length > 1 ? (
              <VariationDropdown
                variations={vehicleVariations[activeModel.uid]}
                selected={selectedVariation}
                onChange={(v) => {
                  setSelectedVariation(v);
                  setSelectedColour(v?.available_colours?.[0] ?? null);
                }}
              />
            ): <div className="flex justify-center items-center mb-6 !w-64 mx-auto border-b border-neutral-300">
            <span className="w-full rounded bg-neutral-100 px-4 pb-1 pt-2.5 font-aktiv_grotesk text-sm font-medium text-neutral-800">
              {selectedVariation?.heading}
            </span>
          </div> }

            {/* Vehicle image — swaps when a colour swatch is clicked */}
            {(selectedColour?.vehicle_image?.url || activeModel.image?.url) && (
              <div className="flex justify-center py-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={selectedColour?.vehicle_image?.url ?? activeModel.image?.url}
                  src={selectedColour?.vehicle_image?.url ?? activeModel.image?.url}
                  alt={selectedColour?.colour?.[0]?.title ?? activeModel.heading}
                  className="max-h-[460px] w-auto max-w-full object-contain"
                />
              </div>
            )}

            {/* Colour swatches — always visible when colours exist */}
            {selectedVariation?.available_colours?.length > 0 && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedVariation.available_colours.map((entry) => {
                    const colour = entry.colour?.[0];
                    if (!colour) return null;
                    const isActive = entry._metadata?.uid === selectedColour?._metadata?.uid;
                    return (
                      <button
                        key={entry._metadata?.uid}
                        title={colour.title}
                        onClick={() => setSelectedColour(entry)}
                        className={
                          "relative h-6 w-6 rounded-full transition-all duration-150 " +
                          (isActive
                            ? "ring-1 ring-offset-1 ring-[#e30613]"
                            : "ring-1 ring-neutral-300 hover:ring-[#e30613]")
                        }
                        style={{ backgroundColor: colour.hex_value }}
                        aria-label={colour.title}
                        aria-pressed={isActive}
                      />
                    );
                  })}
                </div>
                {/* Colour name label below swatches */}
                {selectedColour?.colour?.[0]?.title && (
                  <p className="font-aktiv_grotesk text-sm text-neutral-700">
                    {selectedColour.colour[0].title}
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            {content?.link?.link_text && (
              <div className="mt-8 flex justify-center">
                <a
                  href={content?.link?.internal_link?.[0]?.url || content?.link?.external_link || '#'}
                  className="flex items-center justify-center gap-1 rounded-full border border-isuzu-red bg-transparent px-7 py-2.5 font-aktiv_grotesk text-xs font-semibold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-isuzu-red hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-isuzu-red"
                  {...(content?.$?.link?.internal_link || content?.$?.link?.external_link || {})}
                >
                  <span {...(content?.$?.link?.link_text || {})} className="pt-1">
                    {content?.link?.link_text}
                  </span>
                  <ChevronRightIcon className="size-4" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function groupByDriveType(variations) {
  const groups = [];
  const seen = new Map();
  for (const v of variations) {
    const driveType = v.drive_type ?? extractDriveType(v.title);
    if (!seen.has(driveType)) {
      seen.set(driveType, []);
      groups.push({ label: driveType, items: seen.get(driveType) });
    }
    seen.get(driveType).push(v);
  }
  return groups;
}

function extractDriveType(title = "") {
  const match = title.match(/^(4x[24])/i);
  return match ? match[1].toUpperCase() : "Other";
}

function VariationDropdown({ variations, selected, onChange }) {
  const groups = groupByDriveType(variations);

  return (
    <div className="relative mx-auto mb-6 w-64">
      <Listbox value={selected} onChange={onChange}>
        <ListboxButton className="relative w-full cursor-pointer rounded-sm bg-neutral-100 pt-2.5 pb-1 pl-4 pr-10 text-left font-aktiv_grotesk text-sm text-neutral-800 transition-colors hover:bg-neutral-200 focus:outline-none border-b border-neutral-300">
          <span className="block truncate">{selected?.title ?? "Select variant"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDownIcon className="size-4 text-neutral-500" aria-hidden />
          </span>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          className="z-20 mt-1 w-[var(--button-width)] overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-lg focus:outline-none"
        >
          {groups.map((group) => (
            <div key={group.label}>
              {/* Non-interactive drive type group header */}
              <div className="px-4 pt-3 pb-1 font-aktiv_grotesk text-xs font-semibold text-neutral-400 select-none">
                {group.label}
              </div>
              {group.items.map((v) => (
                <ListboxOption
                  key={v.uid}
                  value={v}
                  className="group flex cursor-pointer items-center gap-2 px-4 py-2 pl-6 font-aktiv_grotesk text-sm text-neutral-800 transition-colors data-[focus]:bg-neutral-100"
                >
                  <CheckIcon className="invisible size-4 shrink-0 text-isuzu-red group-data-[selected]:visible" aria-hidden />
                  {v.heading || v.title}
                </ListboxOption>
              ))}
            </div>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
