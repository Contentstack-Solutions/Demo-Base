import Link from 'next/link';

export default function RegisteredPage(){
    return(
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
                <img className="w-48 h-48" src="https://images.contentstack.io/v3/assets/blt6fecf8c401bbc460/blte9b7013577a727f0/675488e3b7c4663f0d148e3b/panda_face.png" />
                <p className="mt-10 text-center text-3xl font-light">A signup confirmation has been sent to yourm email address.</p>
                <Link href="/account/login" className="flex w-[300px] mt-10 justify-center rounded-md px-3 py-2.5 bg-[#8C4E2A] font-semibold text-white hover:bg-black active:bg-[#F1F2F6] active:text-black">Return to Login</Link>
            </div>
        </div>
    )
}