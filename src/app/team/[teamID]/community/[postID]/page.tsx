const PostPage = async ({params}: {params: Promise<{ teamID: number, postID: number }>}) => {
    const { teamID, postID } = await params;
    
    return(
        <>
            {teamID}, {postID}
        </>
    );
} 

export default PostPage;