"use client";

import { Player } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { useMutation } from "react-query";

const initialPlayer: Player = {
  id: 0,
  name: "",
  backnumber: 0,
  position: "",
  birthdate: "",
  profileimage: "",
  injury: false,
  injuredpart: "",
  recoveryperiod: "",
};


const submitRoster = async ({player, user}: {player: Player, user: string}) => {
  await axios.post("/api/roster", {
    action: "create",
    name: player.name,
    backnumber: player.backnumber,
    birthdate: player.birthdate,
    position: player.position,
    injury: player.injury,
    injuredpart: player.injuredpart,
    recoveryperiod: player.recoveryperiod
  }, {
    headers: {
      requestUser: user
    }
  });
}

const RosterRegisterClient = () => {
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const {data: session} = useSession();
  const router = useRouter();

  const submitRosterMutation = useMutation(submitRoster, {
    onSuccess: () => {
      alert('등록되었습니다.');
      router.push('/roster');
    },
    onError: (error: AxiosError) => {
      console.error("Delete request failed:", error.response?.data || error.message);
  }
  });

  const handleSubmit = ({e, player} : {e: FormEvent; player: Player}) => {
    e.preventDefault();

    if (session?.user?.email) {
      submitRosterMutation.mutate({player: player, user: String(session.user.email)});
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-20">
      <form className="w-full max-w-md space-y-4" onSubmit={(e) => handleSubmit({e, player})}>
        {/* 이름 입력 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={player.name}
            onChange={(e) => setPlayer({ ...player, name: e.target.value })}
            className="mt-1 p-2 border w-full rounded"
            placeholder="선수 이름을 입력하세요."
          />
        </div>

        {/* 등번호 입력 */}
        <div>
          <label htmlFor="backnumber" className="block text-sm font-medium text-gray-700">
            등번호
          </label>
          <input
            type="number"
            id="backnumber"
            name="backnumber"
            value={player.backnumber}
            onChange={(e) => setPlayer({ ...player, backnumber: Number(e.target.value) })}
            className="mt-1 p-2 border w-full rounded"
            placeholder="등번호를 입력하세요."
          />
        </div>

        {/* 생년월일 입력 */}
        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
            생년월일
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={player.birthdate}
            onChange={(e) => setPlayer({ ...player, birthdate: e.target.value })}
            className="mt-1 p-2 border w-full rounded"
          />
        </div>

        {/* 포지션 선택 */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            포지션
          </label>
          <select
            id="position"
            name="position"
            value={player.position}
            onChange={(e) => setPlayer({ ...player, position: e.target.value })}
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

        {/* 프로필 사진 업로드 */}
        <div>
          <label htmlFor="profileimage" className="block text-sm font-medium text-gray-700">
            프로필 사진
          </label>
          <input
            type="file"
            id="profileimage"
            name="profileimage"
            onChange={(e) => setPlayer({ ...player, profileimage: e.target.value })}
            className="mt-1 p-2 border w-full rounded"
          />
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
                checked={player.injury === true}
                onChange={() => setPlayer({ ...player, injury: true })}
                className="mr-2"
              />
              예
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="injury"
                value="false"
                checked={player.injury === false}
                onChange={() => setPlayer({ ...player, injury: false })}
                className="mr-2"
              />
              아니오
            </label>
          </div>
        </div>

        {/* 부상 여부가 true일 때만 표시 */}
        {player.injury && (
          <>
            {/* 부상 부위 */}
            <div>
              <label htmlFor="injuredpart" className="block text-sm font-medium text-gray-700">
                부상 부위
              </label>
              <input
                type="text"
                id="injuredpart"
                name="injuredpart"
                value={player.injuredpart}
                onChange={(e) => setPlayer({ ...player, injuredpart: e.target.value })}
                className="mt-1 p-2 border w-full rounded"
                placeholder="부상 부위를 입력하세요."
              />
            </div>

            {/* 회복 기간 */}
            <div>
              <label htmlFor="recoveryperiod" className="block text-sm font-medium text-gray-700">
                회복 기간
              </label>
              <input
                type="text"
                id="recoveryperiod"
                name="recoveryperiod"
                value={player.recoveryperiod}
                onChange={(e) => setPlayer({ ...player, recoveryperiod: e.target.value })}
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
            등록
          </button>
        </div>
      </form>
    </main>
  );
};

export default RosterRegisterClient;