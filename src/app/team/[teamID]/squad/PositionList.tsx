import { ReceivedSquad } from "@/app/Type";
import Link from "next/link";

const PositionList = ({
  position,
  players,
  teamID,
}: {
  position: string;
  players: ReceivedSquad[];
  teamID: number;
}) => {
  return (
    <div>
      <p>{position}</p>
      {players.length === 0 ? (
        <p>등록된 선수가 없습니다.</p>
      ) : (
        <>
          {players.map((player) => (
            <div key={player.backnumber}>
              <Link href={`/team/${teamID}/squad/${player.backnumber}`}>
                <p>{player.name}</p>
              </Link>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PositionList;
