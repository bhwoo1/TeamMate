"use client";

import { ReceivedSquad } from "@/app/Type";
import axios from "axios";
import { useQuery } from "react-query";
import PositionList from "./PositionList";
import RegisterButton from "./register/RegisterButton";

const fetchSquadList = async ({teamID}: {teamID: number}) => {
  const response = await axios.get("/api/squad", {
    params: {
        teamID: teamID
    }
  });
  return response.data;
};

const SquadList = ({ teamID }: { teamID: number }) => {
  const {
    data: squadList = [],
    isLoading,
    isError,
    error,
  } = useQuery<ReceivedSquad[], Error>("squadList", () => fetchSquadList({teamID}));

  const GKs = squadList.filter((player) => player.position === "GK");
  const DFs = squadList.filter((player) => player.position === "DF");
  const MFs = squadList.filter((player) => player.position === "MF");
  const FWs = squadList.filter((player) => player.position === "FW");

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center">Error: {error.message}</p>;
  return (
    <>
        <PositionList position={"GK"} players={GKs} teamID={teamID} />
        <PositionList position={"DF"} players={DFs} teamID={teamID} />
        <PositionList position={"MF"} players={MFs} teamID={teamID} />
        <PositionList position={"FW"} players={FWs} teamID={teamID} />
        <RegisterButton teamID={teamID} />
    </>
  );
}

export default SquadList;
