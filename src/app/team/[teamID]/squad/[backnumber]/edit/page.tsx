import PlayerEditClient from "./PlayerEditClient";

const PlayerEditPage = async ({
  params,
}: {
  params: Promise<{ teamID: number; backnumber: number }>;
}) => {
  const { teamID, backnumber } = await params;

  return(
    <>
        <PlayerEditClient teamID={teamID} backnumber={backnumber} />
    </>
  );
};

export default PlayerEditPage;
