import React from "react";
import AuthPage from "@/app/components/AuthPage";
import PostCreateClient from "./PostCreateClient";

const PostCreatePage = () => {
    return(
        <AuthPage>
            <PostCreateClient />
        </AuthPage>
    );
}

export default PostCreatePage;