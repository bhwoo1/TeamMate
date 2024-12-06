"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image"


// const SignInBtn = () => {

//   const loginBtnClick = async () => {
//     await signIn("naver");
//   };

//   return (
//     <button
//       className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//       onClick={loginBtnClick}
//     >
//       <p>로그인</p>
//     </button>
//   );
// }


// export default SignInBtn;




const SignInBtn = () => {

  const { data: session } = useSession();

  const loginBtnClick = async () => {
    await signIn("naver");
  };

  return session ? (
    <button onClick={() => signOut()}>
      <Image src={"/Naver_Login/green_logout.png"} width={200} height={100} alt="logout button" />
    </button>
  ) : (
    <button onClick={loginBtnClick}>
      <Image src={"/Naver_Login/green_login.png"} width={200} height={100} alt="login button" />
    </button>
  );
};



export default SignInBtn;