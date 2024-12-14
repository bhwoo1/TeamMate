import PlayerClient from "./PlayerClient";

const PlayerPage = async ({
  params,
}: {
  params: Promise<{ teamID: number; backnumber: number }>;
}) => {
  const { teamID, backnumber } = await params;

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <PlayerClient teamID={teamID} backnumber={backnumber} />
    </div>
  );
};

export default PlayerPage;
