"use client"
import { useEffect, useState } from "react"
import { useSearchParams, usePathname } from "next/navigation";
import { login, signup } from "./actions"
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginPage() {
    const [showRegister, setShowRegister] = useState(false);
    const [showInvalid, setShowInvalid] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const params = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {

        if (params.get('result') === 'invalid'){
            setShowInvalid(true);
            console.log('invalid is set to true')
        }
        else if(params.get('result') === 'exists'){
            setUserExists(true);
        }
    }, [pathname, params])

    return (
        <div className="w-full h-screen flex">
            <div className="w-1/2 p-8">
                <Link href="/">
                    <img className="h-12 w-12" src="https://images.contentstack.io/v3/assets/blt6fecf8c401bbc460/blte9b7013577a727f0/675488e3b7c4663f0d148e3b/panda_face.png" />
                </Link>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="max-w-[320px] overflow-hidden flex">
                        <form className={"min-w-[320px] transition-translate duration-1000  " + (showRegister ? "-ml-[370px]" : "ml-0")}>
                            <p className="text-3xl font-semibold mb-4 text-center">Welcome Back</p>
                            <p className="text-center">
                                Don&apos;t have an account? <button type="button" className="font-semibold underline" onClick={() => setShowRegister(true)}>Create an account
                                </button>
                            </p>

                            {showInvalid &&
                                <p className="mt-5 text-red-600 font-semibold">Invalid Credentials</p>
                            }

                            <div className="mt-8">
                                <label htmlFor="email">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input id="email" name="email" type="email" required onChange={() => setShowInvalid(false)}
                                        className="w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="mt-3 w-full">
                                <label htmlFor="password">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input id="password" name="password" type="password" required onChange={() => setShowInvalid(false)}
                                        className="w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Link href="/account/resetpassword" className="text-right">Forgot password</Link>
                                </div>
                            </div>

                            <button formAction={login}
                                id="login_button"
                                type="submit"
                                className="flex w-full mt-10 justify-center rounded-md px-3 py-2.5 bg-[#8C4E2A] font-semibold text-white hover:bg-black active:bg-[#F1F2F6] active:text-black">
                                Login
                            </button>
                        </form>

                        <form className="min-w-[320px] ml-[50px]">
                            <p className="text-3xl font-semibold mb-4 text-center">Begin Your Journey</p>
                            <button
                                type="button"
                                onClick={() => setShowRegister(false)}
                                className="flex items-center mx-auto"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-3" /> Back to login
                            </button>
                            
                            {userExists &&
                                 <p className="mt-5 text-red-600 font-semibold">User Already Exists</p>
                            }

                            <div className="mt-8">
                                <label htmlFor="register_email">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input id="register_email" name="register_email" type="email" required
                                        className="w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="mt-3 w-full">
                                <label htmlFor="register_password">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input id="register_password" name="register_password" type="password" required
                                        className="w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <button formAction={signup}
                                id="register_button"
                                type="submit"
                                className="flex w-full mt-10 justify-center rounded-md px-3 py-2.5 bg-[#8C4E2A] font-semibold text-white hover:bg-black active:bg-[#F1F2F6] active:text-black">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="w-1/2">
                <img className="w-full h-full object-cover" src="https://images.contentstack.io/v3/assets/blt6fecf8c401bbc460/blt7a953351aec63f14/6754d73e9056e929b4f898db/red_panda_face.jpg" />
            </div>
        </div>
    )
}