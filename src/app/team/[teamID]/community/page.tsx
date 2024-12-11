const CommunityPage = async (params: Promise<{ teamID: number }>) => {
    const teamID = (await params).teamID
    
    return(
        <>{teamID} community</>
    );
}

export default CommunityPage;