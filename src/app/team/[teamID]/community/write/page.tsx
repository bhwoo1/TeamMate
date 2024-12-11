import React from "react"
import PostWriteClient from "./PostWriteClient";

const WritePage = async ({params}: {params: Promise<{ teamID: number }>}) => {
    const { teamID } = await params;

    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <>{teamID} write</>
            <PostWriteClient teamID={teamID}/>
            </div>
    );
}

export default WritePage;