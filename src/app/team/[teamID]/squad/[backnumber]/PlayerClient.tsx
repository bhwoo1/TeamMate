"use client";

import { ReceivedSquad } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import Image from "next/image";
import { userRoleStore } from "@/app/zustand/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

const deletePlayer = async ({ backnumber, teamID, user, username }: { backnumber: number, teamID: number, user: string, username: string }) => {
    await axios.delete(`/api/squad/delete`, {
        headers: {
            requestUser: user,
            requestUsername: username,
            teamID: teamID,
        },
        params: {
            backnumber: backnumber,
        }
    });
}

const PlayerClient = ({
  teamID,
  backnumber,
}: {
  teamID: number;
  backnumber: number;
}) => {
  const {
    data: player,
    isLoading,
    isError,
    error,
  } = useQuery<ReceivedSquad, Error>("player", () =>
    fetchPlayer({ teamID, backnumber })
  );
  const router = useRouter();
  const { isAdmin } = userRoleStore();
  const {data: session} = useSession();

   const deletePlayerMutation = useMutation(deletePlayer, {
          onSuccess: () => {
              alert('삭제되었습니다.');
              router.push(`/team/${teamID}/squad`);
          }, 
          onError: (error: AxiosError) => {
              console.error("Delete request failed:", error.response?.data || error.message);
          }
        });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center">Error: {error.message}</p>;

  const handleDelete = () => {

    console.log(backnumber);
    if (session?.user?.email) {
        deletePlayerMutation.mutate({ backnumber: backnumber, teamID: teamID,  user: String(session.user.email), username: String(session.user.name) });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-20">
      <div>
        <Image
          src={String(player?.profileimage)}
          width={200}
          height={400}
          alt="player_profieimage"
        />
        <p>{player?.backnumber}</p>
        <p>{player?.name}</p>
        <p>{player?.birthdate}</p>
        <p>{player?.position}</p>
      </div>
      {isAdmin === "admin" ? (
        <div>
          <Link href={`/team/${teamID}/squad/${backnumber}/edit`}><button>수정</button></Link>
          <button onClick={handleDelete}>삭제</button>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
};

export default PlayerClient;
