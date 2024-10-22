"use client";

import { signIn } from "next-auth/react";


const SignInBtn = () => {

  const loginBtnClick = async () => {
    await signIn("naver");
  };

  return (
    <button
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={loginBtnClick}
    >
      <p>로그인</p>
    </button>
  );
}


export default SignInBtn;