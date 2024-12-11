const SchedulePage = async ({params}: {params: Promise<{ teamID: number }>}) => {
    const { teamID } = await params;
    
    return(
        <>{teamID} schedule</>
    );
}

export default SchedulePage;