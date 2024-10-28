import React from "react";
import AuthPage from "../components/AuthPage";
import NoticeBoard from "./NoticeBoard";

const NoticePage = () => {
  return (
    <AuthPage>
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-2xl font-bold">공지사항</p>
        <NoticeBoard />
      </div>
    </AuthPage>
  );
}

export default NoticePage;