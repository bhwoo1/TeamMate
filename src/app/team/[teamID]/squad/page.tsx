const SquadPage = async ({params}: {params: Promise<{ teamID: number }>}) => {
    const { teamID } = await params;
    return(
        <>{teamID} squad</>
    );
}

export default SquadPage;