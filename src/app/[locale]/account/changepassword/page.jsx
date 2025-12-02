"use client"

import { useEffect, useState } from "react"
import { changePassword } from "./actions";
import Link from "next/link";

export default function ChangePassword() {
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if(password !== cpassword)
            setShowError(true);
        else
            setShowError(false);
    }, [password, cpassword])

    return (
        <div className="w-full h-screen flex">
            <div className="w-1/2 p-8">
                <Link href="/">
                    <img className="h-12 w-12" src="https://images.contentstack.io/v3/assets/blt6fecf8c401bbc460/blte9b7013577a727f0/675488e3b7c4663f0d148e3b/panda_face.png" />
                </Link>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[320px]">
                        <form>
                            <p className="text-3xl font-semibold mb-4 text-center">New Password</p>
                            <div className="mt-8 w-full">
                                <label htmlFor="password">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input id="password" name="password" type="password" required onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="mt-3 w-full">
                                <label htmlFor="retypepassword">
                                    Confirm Password
                                </label>
                                <div className="mt-2">
                                    <input id="retypepassword" name="password" type="password" required onChange={(e) => setCPassword(e.target.value)}
                                        className="w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                                <p className={"text-red-600 " + (showError ? "" : "invisible")}>Passwords do not match</p>
                            </div>

                            <button formAction={changePassword}
                                id="change_button"
                                type="submit"
                                className="flex w-full mt-10 justify-center rounded-md px-3 py-2.5 bg-[#8C4E2A] font-semibold text-white hover:bg-black enabled:active:bg-[#F1F2F6] enabled:active:text-black disabled:bg-gray-400"
                                disabled={showError}
                            >
                                Change Password
                            </button>

                        </form>
                    </div>
                </div>
            </div>

            <div className="w-1/2">
                <img className="w-full h-full object-cover" src="https://images.contentstack.io/v3/assets/blt6fecf8c401bbc460/blt42934e7c36b5a247/6755cb7017b0852cdd684948/walking.jpg" />
            </div>
        </div>
    )
}