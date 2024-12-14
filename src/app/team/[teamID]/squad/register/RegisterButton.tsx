import { userRoleStore } from "@/app/zustand/store";
import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";

const RegisterButton = ({ teamID }: { teamID: number }) => {
  const { isAdmin } = userRoleStore();
  return (
    <>
      {isAdmin === "admin" ? (
        <div className="flex justify-end items-center mb-4 pt-4">
          <Link href={`/team/${teamID}/squad/register`}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded flex items-center">
              <FaPencilAlt className="text-lg" />
              <span className="pl-2">작성</span>
            </button>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default RegisterButton;
