import React from "react";
import AdminPage from "@/app/components/AdminPage";
import NoticeEditClient from "./NoticeEditClient";

const NoticeEditPage = (props: {params: {id: number}}) => {
   

    return(
        <AdminPage>
            <NoticeEditClient id={props.params.id} />
        </AdminPage>
    );
};

export default NoticeEditPage;