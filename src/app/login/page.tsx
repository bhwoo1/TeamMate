"use client"

import React, { useEffect } from "react";
import SignInBtn from "../components/login/SignInBtn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(session) {
            router.push('/');
        }
    }, [session])

    return(
        <main className="flex flex-col justify-center items-center h-screen">
            <h1>로그인 페이지</h1>
            <SignInBtn />
        </main>
    );
}

export default LoginPage;

// import { redirect } from "next/navigation"
// import { signIn, providerMap } from "@/app/auth"
// import { AuthError } from "next-auth"
 
// export default async function SignInPage(props: {
//   searchParams: { callbackUrl: string | undefined }
// }) {
//   return (
//     <div className="flex flex-col gap-2 justify-center items-center h-screen">
//       {Object.values(providerMap).map((provider, index) => (
//         <form
//             key={index}
//           action={async () => {
//             "use server"
//             try {
//               await signIn(provider.id, {
//                 redirectTo: props.searchParams?.callbackUrl ?? "",
//               })
//               return redirect('/');
//             } catch (error) {
//               if (error instanceof AuthError) {
//                 return redirect('/login');
//               }
//               throw error
//             } 
            
//           }}
//         >
//           <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
//             <span>Sign in with {provider.name}</span>
//           </button>
//         </form>
//       ))}
//     </div>
//   )
// }

// import { providerMap } from "@/app/auth"
// import SignInForm from "./SingInForm"

// export default function SignInPage(props: {
//   searchParams: { callbackUrl: string | undefined }
// }) {
//   return (
//     <div className="flex flex-col gap-2 justify-center items-center h-screen">
//       {Object.values(providerMap).map((provider, index) => (
//         <SignInForm
//           key={index}
//           provider={provider}
//           callbackUrl={props.searchParams?.callbackUrl ?? "/"}
//         />
//       ))}
//     </div>
//   )
// }