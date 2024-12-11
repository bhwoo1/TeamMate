import React from "react"
import PostWriteClient from "./PostWriteClient";

const WritePage = async (params: Promise<{ teamID: number }>) => {
    const teamID = (await params).teamID

    return(
            <PostWriteClient teamID={teamID}/>
    );
}

export default WritePage;