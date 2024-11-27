import React from "react";
import AdminPage from "@/app/components/AdminPage";
import PostEditClient from "./PostEditClient";

const PostEditPage = (props: {params: {id: number}}) => {

    return(
        <AdminPage>
            <PostEditClient id={props.params.id} />
        </AdminPage>
    );
};

export default PostEditPage;