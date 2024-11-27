import AuthPage from "@/app/components/AuthPage";
import React from "react";
import PostClient from "./PostClient";



const PostPage = (props: {params: {id: number}}) => {
    return(
        <AuthPage>
            <PostClient id={props.params.id} />
        </AuthPage>
    );
}

export default PostPage;