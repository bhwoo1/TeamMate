import usePageStore from "@/app/zustand/store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import SignOutBtn from "../login/SignOutBtn";

const Menu:React.FC = () => {
    const {data: session} = useSession();
    const {currentPage, setCurrentPage} = usePageStore();

    return(
        <div className= "left-0 w-full h-full flex flex-col justify-start">
            <Link href="/" className="text-xl font-bold p-8" onClick={() => setCurrentPage("")}>팀메이트</Link>
            <p className="pl-8 pb-8 font-bold">{session?.user?.name} 님</p>
            <Link href="/notice">
                <div className="p-8 cursor-pointer" onClick={() => setCurrentPage("notice")} >
                    <p className={currentPage === 'notice' ? 
                            'font-bold text-xl text-gray-800 pb-2 border-b-4 border-black' 
                        : 
                            'text-base text-gray-500 hover:text-gray-700'
                    }>
                        공지사항
                    </p>
                </div>
            </Link>
            <Link href="/roster">
                <div className="p-8 cursor-pointer" onClick={() => setCurrentPage("roster")}>
                    <p className={currentPage === 'roster' ? 
                            'font-bold text-xl text-gray-800 pb-2 border-b-4 border-black' 
                        : 
                            'text-base text-gray-500 hover:text-gray-700'
                    }>
                        명단 관리
                    </p>
                </div>
            </Link>
            <Link href="/schedule">
                <div className="p-8 cursor-pointer" onClick={() => setCurrentPage("schedule")}>
                    <p className={currentPage === 'schedule' ? 
                            'font-bold text-xl text-gray-800 pb-2 border-b-4 border-black' 
                        : 
                            'text-base text-gray-500 hover:text-gray-700'
                    }>
                        일정 관리
                    </p>
                </div>
            </Link>
            <Link href="/board">
                <div className="p-8 cursor-pointer" onClick={() => setCurrentPage("board")}>
                    <p className={currentPage === 'board' ? 
                            'font-bold text-xl text-gray-800 pb-2 border-b-4 border-black' 
                        : 
                            'text-base text-gray-500 hover:text-gray-700'
                    }>
                        자유게시판
                    </p>
                </div>
            </Link>
            <div className="bottom-0 fixed pb-16">
                {session ? <SignOutBtn /> : null}
            </div>
        </div>
    );
}

export default Menu;