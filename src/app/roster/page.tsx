import React from "react";
import AuthPage from "../components/AuthPage";
import RosterBoard from "./RosterBoard";
import Link from "next/link";

const RosterPage = () => {
  return (
    <AuthPage>
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-2xl font-bold">선수 명단</p>
        <RosterBoard />
        <Link href="/roster/register"><button>등록</button></Link>
      </div>
    </AuthPage>
  );
}

export default RosterPage;