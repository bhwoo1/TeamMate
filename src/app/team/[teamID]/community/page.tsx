import Link from "next/link";

const CommunityPage = async (params: Promise<{ teamID: number }>) => {
    const teamID = (await params).teamID
    
    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <p>{teamID} community</p>
            <Link href={`/team/${teamID}/community/write`}><button>글 쓰기</button></Link>
        </div>
    );
}

export default CommunityPage;