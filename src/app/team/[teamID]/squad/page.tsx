import SquadList from "./SquadList";

const SquadPage = async ({params}: {params: Promise<{ teamID: number }>}) => {
    const { teamID } = await params;
    
    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <SquadList teamID={teamID} />
        </div>
    );
}

export default SquadPage;