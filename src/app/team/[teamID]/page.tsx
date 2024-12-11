import UserRoleVerification from "../UserRoleVerification";
import TeamInfo from "./about/TeamInfo";

const TeamPage = async ({params}: {params: Promise<{ teamID: number }>}) => {
    const { teamID } = await params;

    
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <UserRoleVerification teamID={teamID}/>
            <TeamInfo teamID={teamID} />
        </div>
    );
};

export default TeamPage;