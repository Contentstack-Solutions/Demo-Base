"use client"

import { useState } from "react";
import { createClient } from '@/utils/supabase/client'
import Link from "next/link";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [showSent, setShowSent] = useState(false);
    let [supabase] = useState(() => createClient());

    async function resetSubmit(e) {
        e.preventDefault();

        const { data, error } = await supabase.auth.resetPasswordForEmail(email)

        if (error) {
            alert("Error sending email")
        }

        setShowSent(true);
    }


    return (
        <div className="w-full h-screen flex">
            <div className="w-1/2 p-8">
                <Link href="/">
                    <img className="h-12 w-12" src="https://images.contentstack.io/v3/assets/blt6fecf8c401bbc460/blte9b7013577a727f0/675488e3b7c4663f0d148e3b/panda_face.png" />
                </Link>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[320px]">
                        {!showSent &&
                            <form onSubmit={resetSubmit}>
                                <p className="text-3xl font-semibold mb-4 text-center">Reset Password</p>
                                <div className="mt-8">
                                    <label htmlFor="email">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <button
                                    id="reset"
                                    type="submit"
                                    className="flex w-full mt-10 justify-center rounded-md px-3 py-2.5 bg-[#8C4E2A] font-semibold text-white hover:bg-black active:bg-[#F1F2F6] active:text-black">
                                    Reset Password
                                </button>
                            </form>
                        }
                        {showSent &&
                            <div>
                                <p className="text-3xl font-semibold mb-4 text-center">Password reset sent</p>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="w-1/2">
                <img className="w-full h-full object-cover" src="https://images.contentstack.io/v3/assets/blt6fecf8c401bbc460/blt5beea1c6d827c7ff/6754d73eece1d7b971136381/red_panda_log.jpg" />
            </div>
        </div>
    )
}