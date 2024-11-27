import AuthPage from "@/app/components/AuthPage";
import React from "react";
import NoticeClient from "./NoticeClient";

const NoticePost = (props: {params: {id: number}}) => {
    return(
        <AuthPage>
            <NoticeClient id={props.params.id} />
        </AuthPage>
    );
}

export default NoticePost;