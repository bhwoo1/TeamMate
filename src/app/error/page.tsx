import React from "react";
import AuthPage from "../components/AuthPage";

const ErrorPage = () => {
  return (
    <AuthPage>
      <div className="flex justify-center items-center h-screen">
        <h1 className="">잘못된 접근입니다.</h1>
      </div>
    </AuthPage>
  );
}

export default ErrorPage;