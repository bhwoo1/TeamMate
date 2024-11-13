import React from "react";
import AuthPage from "../components/AuthPage";
import PostBoard from "./PostBoard";

const BoardPage = () => {
  return (
    <AuthPage>
      <div className="flex justify-center items-center h-screen">
        <PostBoard />
      </div>
    </AuthPage>
  );
}

export default BoardPage;