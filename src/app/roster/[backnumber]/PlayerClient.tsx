"use client"

import React from "react";

const PlayerClient = (props: {backnumber: number}) => {
    return(
        <p>{props.backnumber}</p>
    );
}

export default PlayerClient;