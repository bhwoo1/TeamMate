import React from "react";
import AuthPage from "../components/AuthPage";
import PostBoard from "./PostBoard";

const BoardPage = () => {
  return (
    <AuthPage>
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-2xl font-bold">자유게시판</p>
        <PostBoard />
      </div>
    </AuthPage>
  );
}

export default BoardPage;