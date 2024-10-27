"use client"

import axios from "axios";
import React, { useEffect } from "react";

const NoticeBoard = () => {
    // const [noticeArr, setNoticeArr] = useState([]);

    useEffect(() => {
        axios.post("/api/notice", {
            action: 'findMany'
        })
        .then((res) => {
            console.log(res.data);
            //
        })
        .catch((err) => {
            console.log(err);
        });

    }, []);

    return(
        <></>
    );
}

export default NoticeBoard;