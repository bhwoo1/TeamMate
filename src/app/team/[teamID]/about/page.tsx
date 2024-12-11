

const AboutPage = async (params: Promise<{ teamID: number }>) => {
    const teamID = (await params).teamID
    
    return(
        <>{teamID} schedule</>
    );
}

export default AboutPage;