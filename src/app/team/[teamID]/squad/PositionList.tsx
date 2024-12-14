import { ReceivedSquad } from "@/app/Type";

const PositionList = ({
  position,
  players,
}: {
  position: string;
  players: ReceivedSquad[];
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
              <p>{player.name}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PositionList;
