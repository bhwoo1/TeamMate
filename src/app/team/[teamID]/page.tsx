const TeamPage = (prop: {params: {teamID: number}}) => {
    return(
        <p>{prop.params.teamID}</p>
    );
}

export default TeamPage;