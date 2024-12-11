import CommunityBoard from "./CommunityBoard";

const CommunityPage = async ({params}: {params: Promise<{ teamID: number }>}) => {
    const { teamID } = await params;
    
    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <CommunityBoard teamID={teamID}/>
        </div>
    );
}

export default CommunityPage;