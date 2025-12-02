"use client";
import { Fragment, useEffect, useState} from 'react';
import { cslp } from '@/lib/cstack';
import { useRouter } from 'next/navigation';
import { ContentstackClient } from "@/lib/contentstack-client";
import { usePersonalize } from '@/context/personalize.context';
import { createClient } from '@/utils/supabase/client';
import { faCheck, faCircleUser as loggedIn, faCircleQuestion } from '@awesome.me/kit-610837e1f9/icons/classic/solid';
import { faCircleUser as loggedOut } from '@awesome.me/kit-610837e1f9/icons/classic/thin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure, Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useJstag } from '../context/lyticsTracking';
import { useParams } from 'next/navigation';

export default function Header({ color, locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entry, setEntry] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const [user, setUser] = useState({});
  const pathname = usePathname();
  const slug = pathname.slice(3);
  const jstag = useJstag();
  const personalizeSDK = usePersonalize();
  const params = useParams();

  const supabase = createClient();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
    return (user);
  }

  async function logout() {
    if (user) {
      await supabase.auth.signOut();
    }
    localStorage.setItem('profile', "");
    await personalizeSDK.set({ "client_type": "" });

    router.push("/account/login");
  }

  const getContent = async () => {
    const entry = await ContentstackClient.getElementByTypeWithRefs("header", locale, [
      "menu_items.page",
      "menu_items.sub_items.page",
    ]);
    setEntry(entry[0]);
    setIsLoading(false);
  };

  const getProfiles = async (user_id) => {
    let result = await fetch(`/api/profiles/${user_id}`, {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok)
          return response.json();
        else
          return Promise.reject(response);
      })
      .then((result) => {
        let tempProfiles = [];
        for (const profile of result.profiles) {
          tempProfiles.push({
            fname: profile.first_name,
            lname: profile.last_name,
            audience: profile.audience,
            id: profile.id,
            avatar: profile.avatar_url
          })
        }
        setProfiles(tempProfiles);
        let saved = localStorage.getItem('profile');
        if (saved) {
          setSelectedProfile(saved);
          setAvatar(tempProfiles.find(p => p.fname === saved).avatar);
        }

      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    async function getUserId() {
      let currentUser = await getUser();
      if (currentUser) {
        getProfiles(currentUser.id);
      }
    }
    getUserId()
    ContentstackClient.onEntryChange(getContent);
    jstag.call("resetPolling");
  }, []);

  if (isLoading) return;

  function changeLang(language) {
    const path = language + slug;
    router.push("/" + path);
  }

  const changeProfile = async (name) => {
    setSelectedProfile(name);

    if (name === ""){
      localStorage.setItem('profile', "");
      await personalizeSDK.set({ "client_type": "" });
    }
    else {
      const profile = profiles.find(p => p.fname === name);
      localStorage.setItem('profile', profile.fname);
      console.log('audience', profile.audience);
      await personalizeSDK.set({ "client_type": profile.audience });
    }
    window.location.reload();
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div
      className={
        " top-0 min-h-20 flex justify-between w-full font-paragraph py-8 px-8 " +
        (color === "white" ? "text-white absolute" : "text-neutral-700")
      }
    >
      <Link href="/" className={"my-auto" +
        (entry?.image_width === "Auto" ? " w-auto" : " w-40")}>
        {color === "white" && (
          <img className="" src={entry?.light_logo?.url} {...entry?.$?.light_logo} />
        )}
        {color !== "white" && (
          <img className="" src={entry?.dark_logo?.url} {...entry?.$?.dark_logo} />
        )}
      </Link>

      <div className="flex lg:hidden">
        <button className="" onClick={() => setMenuOpen(true)}>
          <Bars3Icon className="h-8 w-8" />
        </button>
      </div>

      <div className="hidden gap-8 lg:flex " {...entry?.$?.menu_items}>
        {(entry?.menu_items && entry?.menu_items?.length > 0) && (
        entry?.menu_items?.map((item, index) => {
          if (item?.sub_items?.length > 0) {
            return (
              <Popover key={index} className="relative px-5" {...cslp(entry, 'menu_items__', index)}>
                <div {...item.$?.page}>
                  <PopoverButton className=" font-paragraph flex items-center outline-none bg-transparent" {...item.$?.text}>
                    {item?.text}
                    <ChevronDownIcon
                      className="h-5 w-5 flex-none"
                      aria-hidden="true"
                    />
                  </PopoverButton>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <PopoverPanel className="absolute top-full right-0 z-10 mt-3 overflow-hidden rounded-lg bg-[#f3f3f9] shadow-lg ">
                    <div className="p-4 text-neutral-700 flex flex-col gap-2" {...item.$?.sub_items}>
                      {(item?.sub_items && item?.sub_items?.length > 0) && (
                      item.sub_items.map((sub, subIdx) => (
                        sub?.page && (
                        <Link
                          key={subIdx}
                          href={sub?.page?.length > 0 ? sub.page[0].url : "#"}
                          className="text-nowrap font-light"
                          {...sub.$?.text}
                        >
                          {sub.text}
                        </Link>
                        )
                      )))}
                    </div>
                  </PopoverPanel>
                </Transition>
              </Popover>
            );
          } else {
            return (
              <div key={index} className="px-5" {...cslp(entry, 'menu_items__', index)} >
                <div {...item.$?.page}>
                  {item?.page && (
                  <Link
                    href={(item?.page?.length > 0 && item?.page[0].url) ? item.page[0].url : "#"}
                    {...item.$?.text}
                  >
                    {item.text}
                  </Link>
                  )}
                </div>
              </div>
            );
          }
        }))}
      </div>


      <div className="hidden lg:flex justify-center align-top" style={{ width: '150px', justifyContent: 'end' }}>

        
        <Link href="/faqs/maldives">

          <FontAwesomeIcon icon={faCircleQuestion} className="mr-5" />
        </Link>

        <div>
          <select
            className="outline-none bg-transparent mr-5"
            value={locale}
            onChange={(e) => {
              changeLang(e.target.value);
            }}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
          </select>
        </div>

        {!user &&
          <Popover className="relative">
            <PopoverButton className="outline-none">
              <FontAwesomeIcon icon={loggedOut} className="text-2xl ml-5" />
            </PopoverButton>

            <PopoverPanel anchor="bottom end" className="flex flex-col py-2 px-4 rounded text-neutral-700 bg-[#f3f3f9] shadow-lg">
              <Link
                href="/account/login"
                className="text-nowrap font-light"
              >
                Log In
              </Link>
            </PopoverPanel>
          </Popover>
        }
        {user &&
          <Popover className="relative">
            <PopoverButton className="outline-none">
              {avatar && 
                <img className="size-8 rounded-full -mt-1.5" src={avatar} />
              }
              {!avatar &&
                <FontAwesomeIcon icon={loggedIn} className="text-4xl -mt-1.5 " />
              }
            </PopoverButton>

            <PopoverPanel anchor="bottom end" className="flex flex-col py-2 px-4 gap-y-1 bg-[#f3f3f9] rounded-lg mt-2 text-neutral-700 shadow-lg">
              <PopoverButton
                className="group flex w-full items-center font-light"
                onClick={() => changeProfile("")}
              >
                <FontAwesomeIcon icon={faCheck} className={`mr-2 ${!selectedProfile ? "" : "opacity-0"}`} />
                Anonymous
              </PopoverButton>
              {profiles?.map((profile, index) => (
                <PopoverButton key={index}
                  className="group flex w-full items-center font-light"
                  onClick={() => changeProfile(profile.fname)}
                >
                  <FontAwesomeIcon icon={faCheck} className={`mr-2 ${selectedProfile === profile.fname ? "" : "opacity-0"}`} />
                  {profile.fname}
                </PopoverButton>
              ))}
              <div className="my-1 h-px bg-black/25" />
              <Link href="/profiles" className="font-light">MANAGE PROFILES</Link>
              <div className="my-1 h-px bg-black/25" />
              <a
                className="text-nowrap font-light cursor-pointer"
                onClick={logout}
              >
                LOG OUT
              </a>
            </PopoverPanel>
          </Popover>
        }

      </div>

      <div
        className={`p-5 right-0 top-0 w-full z-50 duration-200 ease-in-out bg-white fixed h-full ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="text-right">
          <button
            className="cursor-pointer ms-auto text-neutral-700"
            type="button"
            onClick={() => setMenuOpen(false)}
          >
            <XMarkIcon className="h-10" />
          </button>
        </div>
        <div className="flex flex-col text-neutral-700 text-2xl leading-10 uppercase font-paragraph">
          {entry?.menu_items?.map((item, index) => {
            if (item.sub_items?.length > 0) {
              return (
                <Disclosure as="div" className="-mx-3" key={index + item.text}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center pl-3 pr-3.5 uppercase font-paragraph">
                        {item.text}
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "ml-2 h-7 w-7 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2 pb-2 font-paragraph">
                        {item.sub_items.map((item, index) => (
                          <Disclosure.Button
                            key={index + item.text}
                            as="a"
                            href={item.page[0]?.url}
                            className="block rounded-lg pt-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 font-paragraph"
                          >
                            {item.text}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              );
            } else {
              return (
                <Link
                  key={index}
                  href={(item?.page?.length > 0 && item?.page[0].url) ? item.page[0].url : "#"}
                >
                  {item.text}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
