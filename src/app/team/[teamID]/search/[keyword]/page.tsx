import Link from "next/link";
import SearchResultBoard from "./SearchResultBoard";

const CommunityBoard = async ({ params }: { params: Promise<{ teamID: number, keyword: string }> }) => {
    const { teamID, keyword } = await params;

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            {/* 검색어 정렬을 왼쪽으로 */}
            <div className="w-full max-w-3xl flex flex-row justify-between">
                <p className="text-left mb-4">검색어: {keyword}</p>
                <Link href={`/team/${teamID}/community`}><button className="btn-close"></button></Link>
            </div>
            <SearchResultBoard teamID={teamID} />
        </div>
    );
};

export default CommunityBoard;