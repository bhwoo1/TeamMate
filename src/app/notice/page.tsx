import React from "react";
import AuthPage from "../components/AuthPage";
import NoticeBoard from "./NoticeBoard";

const NoticePage = () => {
  return (
    <AuthPage>
      <div className="flex justify-center items-center h-screen">
        <h1 className="">Notice Page</h1>
        <NoticeBoard />
      </div>
    </AuthPage>
  );
}

export default NoticePage;