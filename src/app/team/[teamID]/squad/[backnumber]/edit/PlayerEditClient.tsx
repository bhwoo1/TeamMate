"use client";

import { ReceivedSquad } from "@/app/Type";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const fetchPlayer = async ({
  teamID,
  backnumber,
}: {
  teamID: number;
  backnumber: number;
}) => {
  const response = await axios.get("/api/squad", {
    params: {
      teamID: teamID,
      backnumber: backnumber,
    },
  });
  return response.data;
};

const updatePlayer = async ({
  player,
  user,
  teamID,
  backnumber,
}: {
  player: ReceivedSquad;
  user: string;
  teamID: number;
  backnumber: number;
}) => {
  await axios.put(
    "/api/squad/update",
    {
      name: player.name,
      backnumber: player.backnumber,
      birthdate: player.birthdate,
      position: player.position,
      injury: player.injury,
      injuredpart: player.injuredpart,
      recoveryperiod: player.recoveryperiod,
    },
    {
      headers: {
        requestUser: user,
        teamID: teamID,
        backnumber: backnumber,
      },
    }
  );
};

const PlayerEditClient = ({
  teamID,
  backnumber,
}: {
  teamID: number;
  backnumber: number;
}) => {
  // 선수 데이터 관리
  const [player, setPlayer] = useState<ReceivedSquad | null>(null);
  const { data: session } = useSession(); // next-auth 세션 정보
  const router = useRouter();

  // 선수 데이터 불러오기
  const { isLoading, isError, error } = useQuery<ReceivedSquad, Error>(
    "player",
    () => fetchPlayer({ teamID, backnumber }),
    {
      onSuccess: (data) => setPlayer(data), // 성공 시 상태에 초기화
    }
  );

  const mutation = useMutation(updatePlayer, {
    onSuccess: () => {
      alert("선수 정보가 성공적으로 업데이트되었습니다.");
      router.push(`/team/${teamID}/squad`); // 수정 후 페이지 이동
    },
    onError: (error) => {
      console.error("업데이트 실패:", error);
      alert("업데이트 중 문제가 발생했습니다.");
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center">Error: {error.message}</p>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (session?.user?.email && player) {
      mutation.mutate({
        player,
        user: String(session.user.email),
        teamID,
        backnumber,
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-20">
      <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={player?.name || ""}
            onChange={(e) => setPlayer({ ...player!, name: e.target.value })}
            className="mt-1 p-2 border w-full rounded"
            placeholder="선수 이름을 입력하세요."
          />
        </div>

        {/* 등번호 */}
        <div>
          <label htmlFor="backnumber" className="block text-sm font-medium text-gray-700">
            등번호
          </label>
          <input
            type="number"
            id="backnumber"
            value={player?.backnumber || 0}
            onChange={(e) => setPlayer({ ...player!, backnumber: Number(e.target.value) })}
            className="mt-1 p-2 border w-full rounded"
            placeholder="등번호를 입력하세요."
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
            생년월일
          </label>
          <input
            type="date"
            id="birthdate"
            value={player?.birthdate || ""}
            onChange={(e) => setPlayer({ ...player!, birthdate: e.target.value })}
            className="mt-1 p-2 border w-full rounded"
          />
        </div>

        {/* 포지션 */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            포지션
          </label>
          <select
            id="position"
            value={player?.position || ""}
            onChange={(e) => setPlayer({ ...player!, position: e.target.value })}
            className="mt-1 p-2 border w-full rounded"
          >
            <option value="" disabled>
              포지션을 선택하세요.
            </option>
            <option value="FW">FW</option>
            <option value="MF">MF</option>
            <option value="DF">DF</option>
            <option value="GK">GK</option>
          </select>
        </div>

        {/* 부상 여부 */}
        <div>
          <label htmlFor="injury" className="block text-sm font-medium text-gray-700">
            부상 여부
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="injury"
                value="true"
                checked={player?.injury === true}
                onChange={() => setPlayer({ ...player!, injury: true })}
                className="mr-2"
              />
              예
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="injury"
                value="false"
                checked={player?.injury === false}
                onChange={() => setPlayer({ ...player!, injury: false })}
                className="mr-2"
              />
              아니오
            </label>
          </div>
        </div>

        {/* 부상 상세 정보 */}
        {player?.injury && (
          <>
            <div>
              <label htmlFor="injuredpart" className="block text-sm font-medium text-gray-700">
                부상 부위
              </label>
              <input
                type="text"
                id="injuredpart"
                value={player?.injuredpart || ""}
                onChange={(e) => setPlayer({ ...player!, injuredpart: e.target.value })}
                className="mt-1 p-2 border w-full rounded"
                placeholder="부상 부위를 입력하세요."
              />
            </div>

            <div>
              <label htmlFor="recoveryperiod" className="block text-sm font-medium text-gray-700">
                회복 기간
              </label>
              <input
                type="text"
                id="recoveryperiod"
                value={player?.recoveryperiod || ""}
                onChange={(e) => setPlayer({ ...player!, recoveryperiod: e.target.value })}
                className="mt-1 p-2 border w-full rounded"
                placeholder="회복 기간을 입력하세요."
              />
            </div>
          </>
        )}

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600"
          >
            수정
          </button>
        </div>
      </form>
    </main>
  );
};

export default PlayerEditClient;