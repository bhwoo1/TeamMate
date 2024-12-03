import React from "react";
import PlayerClient from "./PlayerClient";

const PlayerPage = (props: {params: {backnumber: number}}) => {

    return(
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
            <PlayerClient backnumber={props.params.backnumber} />
        </main>
    );
}

export default PlayerPage;