"use client"; 

import { signOut } from "next-auth/react";
import { FaPowerOff } from "react-icons/fa";

const SignOutBtn = () => {
  return (
    <button
      className="font-bold py-2 px-4 rounded text-sm hover:text-red-600"
      onClick={() => signOut()}
    >
      <p className="text-3xl"><FaPowerOff /></p>
    </button>
  );
}

export default SignOutBtn;